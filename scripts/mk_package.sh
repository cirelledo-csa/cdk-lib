#!/bin/bash
mkdir packages/$1  && cd $_
cdk init lib --language=typescript
