import cdk = require('@aws-cdk/core');
import s3 = require('../lib/s3');
import util = require('../lib/util');
import params from '../test/config.json';
import sampleBucket from '../test/sample-bucket.json';

// const branchEnv = util.mapBranchToEnvironment().replace(/\n|\r/g, "");
const branchEnv = util.mapBranchToEnvironment().trim();
// const branchEnv = "dev";

const baseprops = {
  buildUrl: 'nope',
  description: 'Stop Plate Tectonics Now',
  // env: util.mapBranchToEnvironment(),
  env: branchEnv,
  label: 'log',
  owner: 'alfred smithee',
  product: 'sptn',
  source: 'git',
};

const bucketprops = {
  content: 'log',
  description: 'Super Duper Data From the Earth',
  log_bucket_name: '',
  owner: 'alfredette smithee',
  security_level: '1',
  zone: 'log',
};

  const app = new cdk.App();
  const stack = new util.BaseStack(app, { baseprops});
  const myBucket = new s3.Bucket(stack,  { baseprops, bucketprops });
