import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import lakeformationAdminGroup = require('../lib/lakeformationAdminGroup');
import lakeformationAnalystGroup = require('../lib/lakeformationAnalystGroup');
import s3 = require('../lib/s3');
import util = require('../lib/util');
import params from './config.json';
import sampleBucket from './sample-bucket.json';
import sampleLakeformationAdminGroup from './sample-lakeformation-admin-group.json';

// const branchEnv = util.mapBranchToEnvironment().replace(/\n|\r/g, "");
const branchEnv = util.mapBranchToEnvironment().trim();
// const branchEnv = "dev";

const projectProps = {
  description: 'Stop Plate Tectonics Now',
  // env: util.mapBranchToEnvironment(),
  env: branchEnv,
  owner: 'alfred smithee',
  product: 'sptn',
};

const stackProps = {
  description: 'Stop Plate Tectonics Now',
  // env: util.mapBranchToEnvironment(),
  env: branchEnv,
  label: 'Buckets',
  owner: 'alfred smithee',
  product: 'sptn',
};

test('Bucket Created', () => {
  const app = new cdk.App();
  const stackName = util.makeStackName(stackProps);
  const stack = new cdk.Stack(app, stackName);
  // WHEN
  const props = {
    content: 'log',
    description: 'logging',
    // env: util.mapBranchToEnvironment(),
    env: branchEnv,
    label: 'log',
    log_bucket_name: '',
    owner: 'log',
    product: 'mywidget',
    security_level: '1',
    zone: 'log',
  };
  const bucket = new s3.Bucket(stack, 'MyTestBucket', props);
  // THEN
  expectCDK(stack).to(haveResource('AWS::S3::Bucket'));
  expectCDK(stack).toMatch(sampleBucket.dev);
});

test('Admin Group Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  const props = {
    description: 'my lake group',
    env: 'dev',
    label: 'lfadmins',
    owner: 'alfred smithee',
    product: 'mydataproj',
  };
  const group = new lakeformationAdminGroup.LakeformationAdminGroup(stack, props);
  // THEN
  expectCDK(stack).to(haveResource('AWS::IAM::Group'));
  expectCDK(stack).toMatch(sampleLakeformationAdminGroup);
});

test('Analyst Group Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  const props = {
    description: 'my lake group',
    env: 'dev',
    label: 'lfanalysts',
    owner: 'alfred smithee',
    product: 'mydataproj',
  };
  const group = new lakeformationAnalystGroup.LakeformationAnalystGroup(stack, props);
  // THEN
  expectCDK(stack).to(haveResource('AWS::IAM::Group'));
});

test('stack creation with tags', () => {
  const app = new cdk.App();
  // WHEN
  const TagProps = {
    buildUrl: 'https://github.com',
    description: 'Stop Plate Tectonics Now',
    env: 'dev',
    owner: 'alfred.smithee@dot.com',
    product: 'SPTN',
    source: 'https://github.com',
  };
  const stack = new cdk.Stack(app, 'TestStack');
  util.tagStack(stack, TagProps);
  const props = {
    description: 'my lake group',
    env: 'dev',
    label: 'lfanalysts',
    owner: 'alfred smithee',
    product: 'mydataproj',
  };
  const group = new lakeformationAnalystGroup.LakeformationAnalystGroup(stack, props);

  // THEN
  expectCDK(stack).to(haveResource('AWS::IAM::Group'));
  // HOW TO test if tags have been applied?!
});
