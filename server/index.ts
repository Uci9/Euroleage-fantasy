/**
 * API for accounts and the member list.
 *
 * Runs beside Vite in development; Vite proxies /api here, so the browser
 * sees one origin and there is no CORS to configure.
 */

import express from 'express';
import {
  SESSION_COOKIE, createSession, hashPassword, readSession, verifyPassword,
} from './auth';
import { addUser, allUsers, deleteUser, findByEmail, findById, findByUsername, onNetlify, type User } from './store';

const app = express();
const PORT = Number(process.env.API_PORT || 3001);

app.use(express.json());

/** Minimal cookie parsing — one cookie is read, so a dependency is not earned. */
app.use((req, _res, next) => {
  const header = req.headers.cookie ?? '';
  (req as any).cookies = Object.fromEntries(
    header.split(';').map(p => {
      const i = p.indexOf('=');
      return i < 0 ? [p.trim(), ''] : [p.slice(0, i).trim(), decodeURIComponent(p.slice(i + 1))];
    }).filter(([k]) => k)
  );
  next();
});


/**
 * Creates the admin account from the environment, once.
 *
 * create-admin writes to the local file, which is not the store a deployed
 * function reads, so the deployed site would otherwise have no way in. Setting
 * ADMIN_USERNAME and ADMIN_PASSWORD in Netlify makes the account appear on the
 * first request that needs it.
 *
 * It only ever creates a missing admin. Changing the variables later does not
 * change an existing password, so a stale value in the dashboard cannot
 * silently reset the account.
 */
let adminChecked = false;
async function ensureAdmin(): Promise<void> {
  if (adminChecked) return;
  adminChecked = true;

  const username = process.env.ADMIN_USERNAME || 'Admin';
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return;

  try {
    if (await findByUsername(username)) return;
    await addUser({
      username,
      email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
      passwordHash: hashPassword(password),
      fullName: 'Administrator',
      city: '',
      instagram: '',
      isAdmin: true,
    });
    console.log(`Created the admin account "${username}" from the environment.`);
  } catch {
    // Another instance won the race and made it first, which is the outcome
    // either way.
  }
}

app.use(async (_req, _res, next) => {
  await ensureAdmin();
  next();
});

const currentUser = async (req: express.Request) => {
  const id = readSession((req as any).cookies?.[SESSION_COOKIE]);
  return id ? await findById(id) : undefined;
};

/** What the browser is allowed to know about a member. Never the hash. */
const publicUser = (u: User) => ({
  id: u.id, username: u.username, email: u.email, fullName: u.fullName,
  city: u.city, instagram: u.instagram, isAdmin: u.isAdmin, createdAt: u.createdAt,
});

const GMAIL = /^[a-z0-9._%+-]+@gmail\.com$/i;

/**
 * Marked secure everywhere but plain local http.
 *
 * NODE_ENV is not set on Netlify, so keying it on that left the session
 * cookie unmarked on a live https site — where a browser may refuse it
 * outright once anything else on the page sets SameSite=None.
 */
function setSessionCookie(res: express.Response, session: { value: string; maxAge: number }) {
  res.cookie(SESSION_COOKIE, session.value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: onNetlify || process.env.NODE_ENV === 'production',
    maxAge: session.maxAge,
    path: '/',
  });
}

app.post('/api/signup', async (req, res) => {
  const { username = '', email = '', password = '', fullName = '', city = '', instagram = '' } = req.body ?? {};

  const name = String(username).trim();
  const mail = String(email).trim().toLowerCase();

  if (name.length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  if (!/^[a-zA-Z0-9_.-]+$/.test(name)) return res.status(400).json({ error: 'Username can use letters, numbers, dot, dash and underscore only.' });
  if (!GMAIL.test(mail)) return res.status(400).json({ error: 'Please use a Gmail address ending in @gmail.com.' });
  if (String(password).length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  // Checked before writing, and case-insensitively: "Admin" and "admin" are
  // the same name to a person, so they must be the same name here.
  if (await findByUsername(name)) return res.status(409).json({ error: 'That username is already taken.' });
  if (await findByEmail(mail)) return res.status(409).json({ error: 'That Gmail address is already registered.' });

  let user;
  try {
    user = await addUser({
      username: name,
      email: mail,
      passwordHash: hashPassword(String(password)),
      fullName: String(fullName).trim(),
      city: String(city).trim(),
      instagram: String(instagram).trim(),
      isAdmin: false,
    });
  } catch (e: any) {
    // The store checks again as it writes, because two signups can both read
    // "free" before either writes.
    if (e?.message === 'USERNAME_TAKEN') return res.status(409).json({ error: 'That username is already taken.' });
    if (e?.message === 'EMAIL_TAKEN') return res.status(409).json({ error: 'That Gmail address is already registered.' });
    throw e;
  }

  const session = createSession(user.id);
  setSessionCookie(res, session);
  res.json(publicUser(user));
});

app.post('/api/login', async (req, res) => {
  const { identifier = '', password = '' } = req.body ?? {};
  const id = String(identifier).trim();

  // Either handle works, because people remember one or the other.
  const user = (await findByUsername(id)) ?? (await findByEmail(id));

  // One message for both cases on purpose: saying which half was wrong tells
  // a stranger whether a username exists.
  if (!user || !verifyPassword(String(password), user.passwordHash)) {
    return res.status(401).json({ error: 'Wrong username or password.' });
  }

  const session = createSession(user.id);
  setSessionCookie(res, session);
  res.json(publicUser(user));
});

app.post('/api/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE);
  res.json({ ok: true });
});

app.get('/api/me', async (req, res) => {
  const user = await currentUser(req);
  if (!user) return res.status(401).json({ error: 'Not signed in.' });
  res.json(publicUser(user));
});

app.get('/api/admin/members', async (req, res) => {
  const user = await currentUser(req);
  if (!user?.isAdmin) return res.status(403).json({ error: 'Admins only.' });
  const everyone = await allUsers();
  res.json(
    everyone
      .filter(u => !u.isAdmin)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(publicUser)
  );
});

app.delete('/api/admin/members/:id', async (req, res) => {
  const user = await currentUser(req);
  if (!user?.isAdmin) return res.status(403).json({ error: 'Admins only.' });

  const target = await findById(req.params.id);
  if (!target) return res.status(404).json({ error: 'No such member.' });
  // Removing an admin would leave nobody able to see the list.
  if (target.isAdmin) return res.status(400).json({ error: 'Admin accounts cannot be removed here.' });

  await deleteUser(req.params.id);
  res.json({ ok: true });
});

if (onNetlify && !process.env.SESSION_SECRET) {
  // Without it the signing key is random per cold start, so everybody is
  // signed out at unpredictable moments and nobody can tell why.
  console.warn('SESSION_SECRET is not set. Sign-ins will not survive a cold start.');
}

/**
 * Anything unhandled comes back as JSON.
 *
 * Express answers an uncaught error with an HTML page, which the browser reads
 * as "not JSON" and reports as a network fault — sending the reader looking
 * for a connection problem when the server answered perfectly well.
 */
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err?.message ?? 'Something went wrong on the server.' });
});

export default app;

// Only when run directly. On Netlify the app is wrapped by a function instead,
// and a listening socket there would do nothing but hold the process open.
if (!onNetlify) {
  app.listen(PORT, async () => {
    console.log(`API on http://localhost:${PORT}`);
    const admins = (await allUsers()).filter(u => u.isAdmin).length;
    if (admins === 0) console.log('No admin account yet. Run: pnpm run create-admin');
  });
}
