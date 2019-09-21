#!/bin/bash
b=$(git branch | grep -e '^\*' | awk '{print $2}')
export CODEPIPELINE_GIT_BRANCH_NAME=$b
export CODEBUILD_BUILD_URL="https://www.urbandictionary.com"
