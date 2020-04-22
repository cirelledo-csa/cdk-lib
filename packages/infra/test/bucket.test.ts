import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import kms = require('@aws-cdk/aws-kms');
import s3 = require('../lib/s3');
import util = require('../lib/util');
import params from './config.json';
import sampleBucket from './sample-bucket.json';

const branchEnv = util.mapBranchToEnvironment().trim();

const baseprops = {
  application: 'sptn',
  buildId: 'nope',
  createdBy: 'Terry Jones',
  description: 'The Meaning of Life',
  environment: branchEnv,
  label: 'GetMeABucket',
  group: 'Monty Python',
  source: 'git',
};

const bucketprops: s3.IBucketProps = {
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
  util.tagApp(app, { baseprops });
  const stackName = util.makeStackName(baseprops);
  // WHEN
  const stack = new util.BaseStack(app, { baseprops });
  const myBucket = new s3.Bucket(stack, { baseprops, bucketprops });
  // const myKMSBucket = new s3.Bucket(stack, { baseprops, bucketprops });
  // const myS3ManagedBucket = new s3.Bucket(stack, { baseprops, bucketprops });
  // THEN
  expectCDK(stack).to(haveResource('AWS::S3::Bucket'));
  expectCDK(stack).toMatch(sampleBucket.default);
});

test('S3 Managed encrypted Bucket Created', () => {
  const app = new cdk.App();
  util.tagApp(app, { baseprops });
  const stackName = util.makeStackName(baseprops);
  // WHEN
  const stack = new util.BaseStack(app, { baseprops });
  bucketprops.encryption = 'S3_MANAGED';
  const myBucket = new s3.Bucket(stack, { baseprops, bucketprops });
  // const myKMSBucket = new s3.Bucket(stack, { baseprops, bucketprops });
  // const myS3ManagedBucket = new s3.Bucket(stack, { baseprops, bucketprops });
  // THEN
  expectCDK(stack).to(haveResource('AWS::S3::Bucket'));
  expectCDK(stack).toMatch(sampleBucket.s3managed);
});

test('KMS encrypted Bucket Created', () => {
  const app = new cdk.App();
  util.tagApp(app, { baseprops });
  const stackName = util.makeStackName(baseprops);
  // WHEN
  const stack = new util.BaseStack(app, { baseprops });
  bucketprops.encryption = 'KMS';
  const myBucket = new s3.Bucket(stack, { baseprops, bucketprops });
  // const myKMSBucket = new s3.Bucket(stack, { baseprops, bucketprops });
  // const myS3ManagedBucket = new s3.Bucket(stack, { baseprops, bucketprops });
  // THEN
  expectCDK(stack).to(haveResource('AWS::S3::Bucket'));
  expectCDK(stack).toMatch(sampleBucket.kms);
});

test('BYO KMS encrypted Bucket Created', () => {
  const app = new cdk.App();
  util.tagApp(app, { baseprops });
  const stackName = util.makeStackName(baseprops);
  // WHEN
  const stack = new util.BaseStack(app, { baseprops });
  const myKey = new kms.Key(stack, 'MyKey');
  bucketprops.encryption = 'KMS';
  bucketprops.encryptionKey = myKey;
  const myBucket = new s3.Bucket(stack, { baseprops, bucketprops });
  // const myKMSBucket = new s3.Bucket(stack, { baseprops, bucketprops });
  // const myS3ManagedBucket = new s3.Bucket(stack, { baseprops, bucketprops });
  // THEN
  expectCDK(stack).to(haveResource('AWS::S3::Bucket'));
  expectCDK(stack).toMatch(sampleBucket.byokey);
});
