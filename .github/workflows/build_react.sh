#!/bin/bash

set -euo pipefail

cd inthecrowd
node --version
npm install
yarn build
rm -rf node_modules
