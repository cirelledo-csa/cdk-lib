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


# Best practices with helper scripts in package.json

 Consider adding these lines to the scripts section of package.json

## docs

document typescript with [typedoc](https://typedoc.org/guides/doccomments/)

```
    "doc": "typedoc",
```

comments can have the form of:

```
  /**
   * The Product description.
   * @attribute
   */
  description: string;
```

## formatting

format your code with prettier  

```
    "format": "prettier --write \"lib/*.ts\"  \"test/*.ts\"",
```

## linting  

lint your code with tslint  

```
    "lint": "tslint -p tsconfig.json",
```

contents of tslint.json

```
{
   "extends": ["tslint:recommended", "tslint-config-prettier"]
}
```

## testing  

use jest to test your typescript code

```
    "test": "jest",
```

install jest, types and ts preprocessor as dev dependency:

```
npm i jest @types/jest ts-jest -D
```

contents of jest.config.js

```
module.exports = {
    "roots": [
      "<rootDir>/test"
    ],
    testMatch: [ '**/*.test.ts'],
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
  }
```

## scriptes section of package.json in review

may look something like:

```
  "scripts": {
    "build": "tsc",
    "doc": "typedoc",
    "format": "prettier --write \"lib/*.ts\"  \"test/*.ts\"",
    "lint": "tslint -p tsconfig.json",
    "test": "jest",
    "watch": "tsc -w"
  },
```
