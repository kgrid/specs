#!/usr/bin/env sh

# abort on errors
set -e
git config --global user.email "kgrid-developers@umich.edu"
git config --global user.name "circleci"

# build
npm run build
cd docs/.vuepress/dist
git init
git add -A
git commit -m 'deploy'
git push -f https://${GITHUB_TOKEN}@github.com/kgrid/guides.git master:gh-pages
