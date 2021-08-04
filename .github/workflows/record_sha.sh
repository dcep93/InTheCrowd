#!/bin/bash

set -euo pipefail

cd inthecrowd/src/inthecrowd
echo "export default \"$(git rev-parse HEAD)\";" > recorded_sha.tsx
