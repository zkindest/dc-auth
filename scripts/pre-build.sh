#!/bin/bash

echo "checking git commit message for possible \`[skip ci]\`"
echo "VERCEL_GIT_COMMIT_MESSAGE: $VERCEL_GIT_COMMIT_MESSAGE"

if [[ "$VERCEL_GIT_COMMIT_MESSAGE" == *"[skip ci]"* ]] ; then
  # Don't build
  echo "🛑 - Build skipped due to \`[skip ci]\` in commit message."
  exit 0;

else
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;
fi
