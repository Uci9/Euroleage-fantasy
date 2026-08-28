/**
 * Where members are kept.
 *
 * Two backings, chosen by where the code is running:
 *
 *   - On Netlify, a blob. Functions get a fresh, empty filesystem on every
 *     cold start, so a file there would lose every account without warning.
 *   - Anywhere else, a JSON file next to the server, written atomically —
 *     a temp file then a rename, so a crash mid-write cannot leave a
 *     half-written file where the member list used to be.
 *
 * A league of tens of people does not earn a database, and this way there is
 * nothing to install, run or back up in either place.
 */

import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export type User = {
  id: string;
  username: string;
  /** Stored lowercased — the address is the same whatever case it is typed in. */
  email: string;
  passwordHash: string;
  fullName: string;
  city: string;
  instagram: string;
  isAdmin: boolean;
  createdAt: string;
};

type Db = { users: User[] };
const EMPTY: Db = { users: [] };

/** Netlify sets these for every function; nothing else does. */
export const onNetlify = Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT);

// ── File backing ────────────────────────────────────────────────────────────
const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const FILE = join(DIR, 'db.json');

function readFile(): Db {
  if (!existsSync(FILE)) return { users: [] };
  try {
    const parsed = JSON.parse(readFileSync(FILE, 'utf8'));
    return Array.isArray(parsed?.users) ? parsed : { users: [] };
  } catch {
    // A corrupt file must not be silently replaced with an empty one — that
    // would delete the member list on the next write.
    throw new Error(`Could not read ${FILE}. Fix or move the file before starting again.`);
  }
}

function writeFileDb(db: Db): void {
  if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });
  const tmp = `${FILE}.${randomUUID()}.tmp`;
  writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8');
  renameSync(tmp, FILE);
}

// ── Blob backing ────────────────────────────────────────────────────────────
const BLOB_STORE = 'elfb';
const BLOB_KEY = 'members';

async function blobStore() {
  const { getStore } = await import('@netlify/blobs');
  return getStore(BLOB_STORE);
}

async function readBlob(): Promise<Db> {
  const store = await blobStore();
  const raw = await store.get(BLOB_KEY, { type: 'json' });
  return raw && Array.isArray((raw as Db).users) ? (raw as Db) : { ...EMPTY };
}

async function writeBlob(db: Db): Promise<void> {
  const store = await blobStore();
  await store.setJSON(BLOB_KEY, db);
}

// ── One interface over both ─────────────────────────────────────────────────
async function read(): Promise<Db> {
  return onNetlify ? readBlob() : readFile();
}

async function write(db: Db): Promise<void> {
  if (onNetlify) await writeBlob(db);
  else writeFileDb(db);
}

/** Case-insensitive, so "Admin" and "admin" cannot both be taken. */
const fold = (s: string) => s.trim().toLowerCase();

export async function allUsers(): Promise<User[]> {
  return (await read()).users;
}

export async function findByUsername(username: string): Promise<User | undefined> {
  return (await read()).users.find(u => fold(u.username) === fold(username));
}

export async function findByEmail(email: string): Promise<User | undefined> {
  return (await read()).users.find(u => fold(u.email) === fold(email));
}

export async function findById(id: string): Promise<User | undefined> {
  return (await read()).users.find(u => u.id === id);
}

export async function addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const db = await read();

  // Re-checked here, not only in the route: two signups can both read "free"
  // before either writes, and on a serverless platform they may be running in
  // different instances entirely.
  if (db.users.some(u => fold(u.username) === fold(user.username))) {
    throw new Error('USERNAME_TAKEN');
  }
  if (db.users.some(u => fold(u.email) === fold(user.email))) {
    throw new Error('EMAIL_TAKEN');
  }

  const created: User = { ...user, id: randomUUID(), createdAt: new Date().toISOString() };
  db.users.push(created);
  await write(db);
  return created;
}

export async function deleteUser(id: string): Promise<boolean> {
  const db = await read();
  const before = db.users.length;
  db.users = db.users.filter(u => u.id !== id);
  if (db.users.length === before) return false;
  await write(db);
  return true;
}
