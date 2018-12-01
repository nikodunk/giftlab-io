#!/bin/bash

echo -e "\033[0;32mDeploying updates to GitHub Develop Branch...\033[0m"

git add .
git commit -m "newest source deploy `date`"
git push origin develop