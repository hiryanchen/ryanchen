#!/bin/bash
git fetch --all
git reset --hard origin/master
git pull
forever stopall
sudo PORT=80 DEBUG=ryanchen:server forever start ./bin/www
