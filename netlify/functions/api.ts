/**
 * The account API, as a Netlify function.
 *
 * It is the same Express app the local server runs, wrapped rather than
 * rewritten — two copies of signup rules would drift, and the one that drifted
 * would be the one nobody tested.
 *
 * netlify.toml sends /api/* here, so the browser still talks to one origin and
 * there is no cross-origin anything to configure.
 */

import serverless from 'serverless-http';
import app from '../../server/index';

export const handler = serverless(app);
