#!/bin/bash

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

git add .
git commit -m "newest source deploy `date`"
git push origin master

echo -e "\033[0;32mDeploying updates to Heroku...\033[0m"

# Push source and build repos.
git push heroku master