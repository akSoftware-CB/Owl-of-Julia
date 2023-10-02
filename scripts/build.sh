#! /bin/bash

echo "### ESBUILD"
npm run esbuild

echo "### BABEL"
npx babel --verbose ./dist/shared_code.js -o ./dist/shared_code.babelized.js

echo "### CB babelized"
echo '/* eslint-disable no-undef */' > ./dist/shared_code.cb-babelized.js
cat ./dist/shared_code.babelized.js >> ./dist/shared_code.cb-babelized.js
