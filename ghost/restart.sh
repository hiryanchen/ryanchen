#!/bin/bash
git fetch --all
git reset --hard origin/master
git pull
forever stop index.js
NODE_ENV=production forever start index.js
