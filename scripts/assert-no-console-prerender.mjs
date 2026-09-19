#!/usr/bin/env node
// Build gate (plan §8a): the /console route must never be written to disk as
// static HTML. app.routes.server.ts already tells the prerenderer to skip it
// (RenderMode.Client), but a route config edit is easy to get wrong silently —
// this fails the build loudly instead.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const distRoot = join(process.cwd(), 'dist', 'baobab', 'browser');
const consoleDir = join(distRoot, 'console');

if (existsSync(consoleDir)) {
  console.error(
    `Build gate failed: ${consoleDir} exists.\n` +
      '/console must never be prerendered — check app.routes.server.ts has ' +
      "{ path: 'console/**', renderMode: RenderMode.Client } ABOVE the '**' wildcard.",
  );
  process.exit(1);
}

console.log('Build gate: /console is not in the static output. OK.');
