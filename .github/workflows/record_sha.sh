#!/bin/bash

set -euo pipefail

cd inthecrowd/src/inthecrowd
printf "// eslint-disable-next-line import/no-anonymous-default-export\nexport default \"%s\";\n" "$(git rev-parse HEAD)" > recorded_sha.tsx
