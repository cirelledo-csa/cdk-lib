# cdk libraries, University of California, Office of the President

This is the source for [published](https://www.npmjs.com/settings/ucop-acme/packages) cdk libraries 

## making new package


```
#!/bin/bash
mkdir packages/$1  && cd $_
cdk init lib --language=typescript
```

```
sh scripts/mk_package.sh test
```
