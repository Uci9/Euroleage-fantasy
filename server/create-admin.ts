/**
 * Creates the admin account.
 *
 * Kept out of the server so a password never has to live in the code that
 * runs. It is read from the environment and it is not stored — only its hash
 * goes into the file.
 */

import { hashPassword } from './auth';
import { addUser, findByUsername } from './store';

const username = process.env.ADMIN_USERNAME || 'Admin';
const email = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const password = process.env.ADMIN_PASSWORD;

if (!password) {
  console.error('Set ADMIN_PASSWORD first, e.g.:\n  ADMIN_PASSWORD=your-password pnpm run create-admin');
  process.exit(1);
}

if (findByUsername(username)) {
  console.error(`"${username}" already exists. Delete it from data/db.json to recreate it.`);
  process.exit(1);
}

addUser({
  username, email, passwordHash: hashPassword(password),
  fullName: 'Administrator', city: '', instagram: '', isAdmin: true,
});

console.log(`Admin account "${username}" created.`);
