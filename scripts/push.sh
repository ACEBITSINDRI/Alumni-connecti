#!/bin/bash
cd /d/Alumni-connect
git fetch origin
git rebase origin/main
git push origin main
echo "Push complete"
