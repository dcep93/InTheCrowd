#!/bin/bash

set -euo pipefail

cd inthecrowd/build
export GOOGLE_APPLICATION_CREDENTIALS="gac.json"
echo "$1" > "$GOOGLE_APPLICATION_CREDENTIALS"
gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
firebase init
firebase deploy
