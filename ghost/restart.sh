#!/bin/bash
git pull
forever stop index.js
NODE_ENV=production forever start index.js
