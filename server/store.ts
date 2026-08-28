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

/**
 * Which backing to use.
 *
 * Normally decided by where the code runs. STORE=file overrides it, which is
 * how the function can be exercised locally: blob emulation needs a linked
 * site, and everything else about the function is worth testing without one.
 */
const useBlobs = onNetlify && process.env.STORE !== 'file';

// ── File backing ────────────────────────────────────────────────────────────
/**
 * Worked out on first use, not at import.
 *
 * Netlify bundles the function to CommonJS, where import.meta.url is
 * undefined — and computing this at import time threw before a single request
 * was handled, on a path the deployed site never even uses.
 */
let paths: { dir: string; file: string } | null = null;
function filePaths() {
  if (paths) return paths;
  const here = typeof import.meta?.url === 'string'
    ? dirname(fileURLToPath(import.meta.url))
    : process.cwd();
  const dir = join(here, '..', 'data');
  paths = { dir, file: join(dir, 'db.json') };
  return paths;
}

function readFile(): Db {
  const { file } = filePaths();
  if (!existsSync(file)) return { users: [] };
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8'));
    return Array.isArray(parsed?.users) ? parsed : { users: [] };
  } catch {
    // A corrupt file must not be silently replaced with an empty one, which
    // would delete the member list on the next write.
    throw new Error(`Could not read ${file}. Fix or move the file before starting again.`);
  }
}

function writeFileDb(db: Db): void {
  const { dir, file } = filePaths();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const tmp = `${file}.${randomUUID()}.tmp`;
  writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8');
  renameSync(tmp, file);
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
  if (!useBlobs) return readFile();
  try {
    return await readBlob();
  } catch (e: any) {
    // Reported as itself rather than as a stack trace the browser reads as a
    // network fault: a missing blob store is a setup problem, and saying so is
    // the difference between a five-minute fix and an afternoon.
    throw new Error(`Cannot reach the member store. ${e?.message ?? e}`);
  }
}

async function write(db: Db): Promise<void> {
  if (!useBlobs) { writeFileDb(db); return; }
  try {
    await writeBlob(db);
  } catch (e: any) {
    throw new Error(`Cannot write to the member store. ${e?.message ?? e}`);
  }
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
