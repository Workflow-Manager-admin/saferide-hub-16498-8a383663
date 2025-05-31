#!/bin/bash
cd /home/kavia/workspace/code-generation/saferide-hub-16498-8a383663/safe_ride_hub
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

