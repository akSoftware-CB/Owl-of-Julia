#!/usr/bin/env node

import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/js/shared_code.mjs'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outdir: 'dist',
}).catch(() => process.exit(1));