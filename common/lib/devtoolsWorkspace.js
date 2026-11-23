/**
 * Middleware for express, handling the Chrome devtools
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 20.11.2026
 **/

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export function chromeDevtoolsWorkspace(options = {}) {
  const rootDir  = options.root || path.resolve(process.cwd());
  const uuidFile = path.join(rootDir, '.chrome-devtools-uuid');
  const enabled  = options.enabled ?? (process.env.NODE_ENV === 'development');

  let cachedUuid = null;

  async function getOrCreateUuid() {
    if (cachedUuid) {
      return cachedUuid;
    }

    try {
      const existing = await fs.readFile(uuidFile, 'utf8');
      cachedUuid     = existing.trim();
      return cachedUuid;
    }
    catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    cachedUuid = crypto.randomUUID();
    await fs.writeFile(uuidFile, `${cachedUuid}\n`, 'utf8');
    return cachedUuid;
  }

  return async (req, res, next) => {
    if (req.path !== '/.well-known/appspecific/com.chrome.devtools.json') {
      return next();
    }

    if (!enabled) {
      return res.status(404).end();
    }

    try {
      const uuid = await getOrCreateUuid();
      res.json({
        workspace: {
          root: rootDir,
          uuid
        }
      });
    }
    catch (err) {
      next(err);
    }
  };
}
