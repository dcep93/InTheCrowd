#!/bin/bash

set -euo pipefail

export GOOGLE_APPLICATION_CREDENTIALS="gac.json"
echo "$1" > "$GOOGLE_APPLICATION_CREDENTIALS"
npm install -g firebase-tools
gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
firebase deploy
git rev-parse HEAD
