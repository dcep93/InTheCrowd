#!/bin/bash

set -euo pipefail

cd inthecrowd/src/inthecrowd
read -r -d '' code << 'EOF'
// eslint-disable-next-line import/no-anonymous-default-export
export default "%s";

EOF
printf "$code\n" "$(git rev-parse HEAD)" > recorded_sha.tsx
