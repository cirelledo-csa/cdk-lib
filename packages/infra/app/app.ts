import cdk = require('@aws-cdk/core');
import s3 = require('../lib/s3');
import util = require('../lib/util');
import params from '../test/config.json';
import sampleBucket from '../test/sample-bucket.json';
import { Buckets } from './lib/buckets';

const branchEnv = util.mapBranchToEnvironment().trim();

const baseprops = {
  buildUrl: 'nope',
  costprops: {
    env: branchEnv,
    owner: 'Mrs Creosote',
    product: 'sptn',
  },
  description: 'Stop Plate Tectonics Now',
  env: branchEnv,
  label: 'GetMeABucket',
  owner: 'Mr Creosote',
  product: 'sptn',
  source: 'git',
};

const bucketprops = {
  content: 'magma',
  description: 'Super Hot Data From the Earth',
  label: 'sample',
  log_bucket_name: '/dev/null',
  owner: 'Ms Creosote',
  security_level: '1',
  zone: 'core',
};

const stackEnv = { account: '012345678910', region: 'us-east-2' };

const myStackProps: util.IBaseStackProps = {
  env: stackEnv,
  baseprops: {
    buildUrl: 'https://google.com',
    costprops: {
      env: branchEnv,
      owner: 'Mrs Creosote',
      product: 'sptn',
    },
    description: 'Stop Plate Tectonics Now',
    env: branchEnv,
    label: 'Buckets',
    owner: 'Mr Creosote',
    product: 'sptn',
    source: 'git',
  },
};

const app = new cdk.App();
const stack = new util.BaseStack(app, { baseprops });
const myBucket = new s3.Bucket(stack, { baseprops, bucketprops });
bucketprops.label = 'other';
const myOtherBucket = new s3.Bucket(stack, { baseprops, bucketprops });
const buckets = new Buckets(app, myStackProps);
