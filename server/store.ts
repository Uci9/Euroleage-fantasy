/**
 * Data lives in a single JSON file next to the server.
 *
 * A league of this size has tens of members, not thousands — a database would
 * be a second thing to install, run and back up for no gain. The file is
 * written atomically (write a temp file, then rename) so a crash mid-write
 * cannot leave a half-written file where the member list used to be.
 */

import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const FILE = join(DIR, 'db.json');

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

function read(): Db {
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

function write(db: Db): void {
  if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });
  const tmp = `${FILE}.${randomUUID()}.tmp`;
  writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8');
  renameSync(tmp, FILE);
}

/** Case-insensitive, so "Admin" and "admin" cannot both be taken. */
const fold = (s: string) => s.trim().toLowerCase();

export function allUsers(): User[] {
  return read().users;
}

export function findByUsername(username: string): User | undefined {
  return read().users.find(u => fold(u.username) === fold(username));
}

export function findByEmail(email: string): User | undefined {
  return read().users.find(u => fold(u.email) === fold(email));
}

export function findById(id: string): User | undefined {
  return read().users.find(u => u.id === id);
}

export function addUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const db = read();
  const created: User = { ...user, id: randomUUID(), createdAt: new Date().toISOString() };
  db.users.push(created);
  write(db);
  return created;
}

export function deleteUser(id: string): boolean {
  const db = read();
  const before = db.users.length;
  db.users = db.users.filter(u => u.id !== id);
  if (db.users.length === before) return false;
  write(db);
  return true;
}
