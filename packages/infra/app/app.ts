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
