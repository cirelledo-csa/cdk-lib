# Why?
These are helper libraries to unify some of the basic stack operations in AWS.
Intended for use with codepipeline/codebuild

# Example useage of stack tagging

 ```ts
import cdk = require('@aws-cdk/core');
import s3 = require('../lib/s3');
import util = require('../lib/util');
import params from '../test/config.json';
import sampleBucket from '../test/sample-bucket.json';
import { Buckets } from './lib/buckets';

const branchEnv = util.mapBranchToEnvironment().trim();

const baseprops = {
  application: 'sptn',
  buildId: 'nope',
  createdBy: 'alfred smithee',
  description: 'Stop Plate Tectonics Now',
  environment: branchEnv,
  group: 'montyPython',
  label: 'GetMeABucket',
  owner: 'King Khalid',
  source: 'codecommit:us-west-2:012345678910:sptn',
};

const bucketprops = {
  content: 'magma',
  description: 'Super Hot Data From the Earth',
  encryption: 'KMS',
  label: 'sample',
  log_bucket_name: '/dev/null',
  owner: 'Ms Creosote',
  security_level: '1',
  zone: 'core',
};

const stackEnv = { account: '012345678910', region: 'us-east-2' };

const myStackProps: util.IBaseStackProps = {
  description: 'Stop Plate Tectonics Now' + util.makeBrand(),
  env: stackEnv,
  baseprops: {
    application: 'sptn',
    buildId: 'https://google.com',
    createdBy: 'alfred smithee',
    description: 'Stop Plate Tectonics Now',
    environment: branchEnv,
    group: 'Mr Creosote',
    label: 'Buckets',
    owner: 'King Khalid',
    source: 'codecommit:us-west-2:012345678910:sptn',
  },
};

const app = new cdk.App();
// add standard tags to all constructs in app
util.tagApp(app, myStackProps);
const stack = new util.BaseStack(app, { description: baseprops.description + util.makeBrand(), baseprops });
const myBucket = new s3.Bucket(stack, { baseprops, bucketprops });
bucketprops.label = 'other';
const myOtherBucket = new s3.Bucket(stack, { baseprops, bucketprops });
const buckets = new Buckets(app, myStackProps);
 ```

 This will create two stacks:

 ```
cdk ls
sptnProdBuckets
sptnProdGetMeABucket
```

Notice that the generated templates contain standard tag meta:

```
cat cdk.out/manifest.json | jq '.artifacts.sptnProdGetMeABucket.metadata["/sptnProdGetMeABucket"][].data'
[
  {
    "Key": "ucop:application",
    "Value": "sptn"
  },
  {
    "Key": "ucop:buildId",
    "Value": "https://google.com"
  },
  {
    "Key": "ucop:createdBy",
    "Value": "alfred smithee"
  },
  {
    "Key": "ucop:environment",
    "Value": "prod"
  },
  {
    "Key": "ucop:group",
    "Value": "Mr Creosote"
  },
  {
    "Key": "ucop:owner",
    "Value": "King Khalid"
  },
  {
    "Key": "ucop:source",
    "Value": "codecommit:us-west-2:012345678910:sptn"
  },
  {
    "Key": "ucop:tagVersion",
    "Value": "0.1"
  }
]
```

 # Tags from json file:

 ```json
{
  "tags": {
    "Description": "Stop Plate Tectonics Now",
    "Owner": "alfred.smithee@google.com",
    "Product": "sptn"
  }
}
 ```

 # example of bucket creation
 ```ts
import infra = require("@ucop-acme/aws-infra");

    // product Logging bucket

    const LoggingBucket = new infra.Bucket(this, "log", {
      content: "log",
      description: "logging",
      env: envBranch,
      label: "log",
      log_bucket_name: "",
      owner: "log",
      product: params[`tags`][`Product`],
      security_level: "1",
      zone: "log"
    });
 ```
