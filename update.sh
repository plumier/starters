#!/bin/bash

# make sure if its in master branch
if [[ $(git rev-parse --abbrev-ref HEAD) != "master" ]]; then 
    echo 'Command must be run in master branch';
    exit 1
fi 
# update root package
ncu -u
# update pckages
for file in ./*/package.json; do
    ncu -u --packageFile "$file"
done
# check if update successful
if git diff-index --quiet HEAD --; then
    # No git changes (no update)
    echo 'Packages already up to date!'
    exit 1
fi
# remove all dependent libraries
rm -f yarn.lock 
rm -rf node_modules
# install and test
yarn install