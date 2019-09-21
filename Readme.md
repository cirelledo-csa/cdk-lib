# cdk libraries, University of California, Office of the President

## making new package


```
#!/bin/bash
mkdir packages/$1  && cd $_
cdk init lib --language=typescript
```

```
sh scripts/mk_package.sh test
```
