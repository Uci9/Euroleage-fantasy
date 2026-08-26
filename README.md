# EL Fantasy Balkan

Fantasy league site. Built for the phone first, since people arrive from
Instagram. Same visual language as Eurocourt.

## Running it

Two processes — the site and the API:

```bash
pnpm install
pnpm run dev:api     # API on :3001
pnpm run dev         # site on :5173
```

Open `http://localhost:5173`. Vite proxies `/api` to the API, so the browser
sees one origin. The site also listens on the network, so
`http://<this-machine-ip>:5173` opens on a phone on the same wifi — the only
honest way to check a site built for phones.

## The admin account

Created once, from the command line, so a password never lives in the code:

```bash
ADMIN_PASSWORD='your-password' pnpm run create-admin
```

Only the hash is stored. Sign in through the site to reach the admin panel and
the member list.

## Accounts

Creating an account *is* the league entry — one form, no way to end up
registered for one and not the other. Usernames and Gmail addresses are unique,
compared case-insensitively, so `Admin` and `admin` are the same name.

## Where the content lives

**`src/lib/content.ts`** — every piece of text. Anything marked `TODO` is
waiting on your details and is flagged on the site itself: places, prizes, and
the remaining rules, plus the Instagram, Viber and contact links.

The logo is `public/logo.jpg` (and `logo-small.jpg` for the header).

## Data

Members live in `data/db.json`, written atomically. It is gitignored — it holds
real people's addresses.

Schedule, live scores and the table come straight from the official EuroLeague
service in the browser. The table is computed from played games, so it is empty
until the season starts and fills itself.

## Before this goes public

- **Serve it over HTTPS** and set `secure: true` on the session cookie.
- **Set `SESSION_SECRET`** so a restart does not sign everybody out.
- The entry fee is collected off the site; nothing here takes payments.
