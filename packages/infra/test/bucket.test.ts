import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import s3 = require('../lib/s3');
import util = require('../lib/util');
import params from './config.json';
import sampleBucket from './sample-bucket.json';

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
  content: 'log',
  description: 'Super Duper Data From the Earth',
  label: 'magma',
  log_bucket_name: '',
  owner: 'Ms Creosote',
  security_level: '1',
  zone: 'log',
};

test('Bucket Created', () => {
  const app = new cdk.App();
  const stackName = util.makeStackName(baseprops);
  // WHEN
  const stack = new util.BaseStack(app, { baseprops });
  const myBucket = new s3.Bucket(stack, { baseprops, bucketprops });
  // THEN
  expectCDK(stack).to(haveResource('AWS::S3::Bucket'));
  expectCDK(stack).toMatch(sampleBucket.junk4);
});
