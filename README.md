# EL Fantasy Balkan

Fantasy league site. Built for the phone first, since people arrive from
Instagram. Same visual language as Eurocourt.

## Running it locally

```bash
pnpm install
pnpm start
```

The site on :5173 and the account API on :3001, in one command. They are one
command on purpose: with two it is easy to start only the site, and signing in
then fails with nothing on screen explaining why.

To run it the way Netlify does, through the function:

```bash
NETLIFY=1 STORE=file ADMIN_PASSWORD=something SESSION_SECRET=anything \
  npx netlify dev --port 8888 --offline
```

`STORE=file` is only for this: blob emulation needs a linked site, and
everything else about the function is worth testing without one.

## Deploying

Netlify serves the built site and runs the API as a function. `netlify.toml`
routes `/api/*` to it, so the browser talks to one origin.

**Two settings must exist in Netlify** (Site configuration, Environment
variables), or the site will look broken in ways that are hard to guess at:

| Variable | Why |
| --- | --- |
| `SESSION_SECRET` | Signs the session cookie. Without it the key is random per cold start, so people are signed out at unpredictable moments. Any long random string. |
| `ADMIN_PASSWORD` | Creates the admin account on first use. `create-admin` writes to a local file the deployed function never reads, so this is the only way in. |

`ADMIN_USERNAME` and `ADMIN_EMAIL` are optional and default to `Admin` and
`admin@gmail.com`. The admin is only ever created when missing, so changing
these later does not reset an existing account.

## Where the content lives

**`src/lib/content.ts`** holds every piece of text. Anything marked `TODO` is
waiting on your details and is flagged on the site itself: places, prizes, the
remaining rules, and the Instagram, Viber and contact links.

The logo is `public/logo.jpg`, and `logo-small.jpg` for the header.

## Data

Members live in a Netlify blob when deployed and in `data/db.json` locally.
Functions get a fresh, empty filesystem on every cold start, so a file there
would lose every account without warning.

`data/` is gitignored; it holds real people's addresses.

Schedule, live scores and the table come straight from the official EuroLeague
service in the browser. The table is computed from played games, so it starts
level and fills itself.

## Not done yet

The entry fee is collected off the site. Nothing here takes payments.
