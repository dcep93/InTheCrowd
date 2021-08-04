#!/bin/bash

set -euo pipefail

cd inthecrowd
npm install
yarn build
rm -rf node_modules
