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
import { addUser, allUsers, deleteUser, findByEmail, findById, findByUsername } from './store';

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

const currentUser = (req: express.Request) => {
  const id = readSession((req as any).cookies?.[SESSION_COOKIE]);
  return id ? findById(id) : undefined;
};

/** What the browser is allowed to know about a member. Never the hash. */
const publicUser = (u: NonNullable<ReturnType<typeof findById>>) => ({
  id: u.id, username: u.username, email: u.email, fullName: u.fullName,
  city: u.city, instagram: u.instagram, isAdmin: u.isAdmin, createdAt: u.createdAt,
});

const GMAIL = /^[a-z0-9._%+-]+@gmail\.com$/i;

app.post('/api/signup', (req, res) => {
  const { username = '', email = '', password = '', fullName = '', city = '', instagram = '' } = req.body ?? {};

  const name = String(username).trim();
  const mail = String(email).trim().toLowerCase();

  if (name.length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  if (!/^[a-zA-Z0-9_.-]+$/.test(name)) return res.status(400).json({ error: 'Username can use letters, numbers, dot, dash and underscore only.' });
  if (!GMAIL.test(mail)) return res.status(400).json({ error: 'Please use a Gmail address ending in @gmail.com.' });
  if (String(password).length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  // Checked before writing, and case-insensitively: "Admin" and "admin" are
  // the same name to a person, so they must be the same name here.
  if (findByUsername(name)) return res.status(409).json({ error: 'That username is already taken.' });
  if (findByEmail(mail)) return res.status(409).json({ error: 'That Gmail address is already registered.' });

  const user = addUser({
    username: name,
    email: mail,
    passwordHash: hashPassword(String(password)),
    fullName: String(fullName).trim(),
    city: String(city).trim(),
    instagram: String(instagram).trim(),
    isAdmin: false,
  });

  const session = createSession(user.id);
  res.cookie(SESSION_COOKIE, session.value, { httpOnly: true, sameSite: 'lax', maxAge: session.maxAge });
  res.json(publicUser(user));
});

app.post('/api/login', (req, res) => {
  const { identifier = '', password = '' } = req.body ?? {};
  const id = String(identifier).trim();

  // Either handle works, because people remember one or the other.
  const user = findByUsername(id) ?? findByEmail(id);

  // One message for both cases on purpose: saying which half was wrong tells
  // a stranger whether a username exists.
  if (!user || !verifyPassword(String(password), user.passwordHash)) {
    return res.status(401).json({ error: 'Wrong username or password.' });
  }

  const session = createSession(user.id);
  res.cookie(SESSION_COOKIE, session.value, { httpOnly: true, sameSite: 'lax', maxAge: session.maxAge });
  res.json(publicUser(user));
});

app.post('/api/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE);
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ error: 'Not signed in.' });
  res.json(publicUser(user));
});

app.get('/api/admin/members', (req, res) => {
  const user = currentUser(req);
  if (!user?.isAdmin) return res.status(403).json({ error: 'Admins only.' });
  res.json(
    allUsers()
      .filter(u => !u.isAdmin)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(publicUser)
  );
});

app.delete('/api/admin/members/:id', (req, res) => {
  const user = currentUser(req);
  if (!user?.isAdmin) return res.status(403).json({ error: 'Admins only.' });

  const target = findById(req.params.id);
  if (!target) return res.status(404).json({ error: 'No such member.' });
  // Removing an admin would leave nobody able to see the list.
  if (target.isAdmin) return res.status(400).json({ error: 'Admin accounts cannot be removed here.' });

  deleteUser(req.params.id);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
  const admins = allUsers().filter(u => u.isAdmin).length;
  if (admins === 0) console.log('No admin account yet — run: pnpm run create-admin');
});
