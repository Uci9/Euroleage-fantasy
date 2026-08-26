/**
 * Passwords and sessions.
 *
 * Passwords are hashed with scrypt and a per-user salt, so the stored file
 * never holds one in a readable form. Comparison is timing-safe: a plain
 * string compare leaks how much of a hash matched, one character at a time.
 *
 * Sessions are a signed cookie rather than server-side state. Restarting the
 * server therefore does not sign everybody out, and there is no session table
 * to grow forever.
 */

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const DAY = 24 * 60 * 60 * 1000;
export const SESSION_COOKIE = 'elfb_session';
const SESSION_DAYS = 30;

/**
 * The key that signs sessions. Random per start unless one is supplied, which
 * means sessions survive a restart only when the operator asks for it — a
 * hardcoded default would be a key published in the repository.
 */
const SECRET = process.env.SESSION_SECRET || randomBytes(32).toString('hex');

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

function sign(value: string): string {
  return createHmac('sha256', SECRET).update(value).digest('hex');
}

export function createSession(userId: string): { value: string; maxAge: number } {
  const expires = Date.now() + SESSION_DAYS * DAY;
  const payload = `${userId}.${expires}`;
  return { value: `${payload}.${sign(payload)}`, maxAge: SESSION_DAYS * DAY };
}

/** The user id in a cookie, or null if it is missing, expired or forged. */
export function readSession(cookie: string | undefined): string | null {
  if (!cookie) return null;
  const parts = cookie.split('.');
  if (parts.length !== 3) return null;
  const [userId, expires, signature] = parts;
  const payload = `${userId}.${expires}`;

  const expected = Buffer.from(sign(payload), 'hex');
  const given = Buffer.from(signature, 'hex');
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  if (Number(expires) < Date.now()) return null;
  return userId;
}
