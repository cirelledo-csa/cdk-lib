import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import lakeformationAdminGroup = require('../lib/lakeformationAdminGroup');
import lakeformationAnalystGroup = require('../lib/lakeformationAnalystGroup');
import s3 = require('../lib/s3');
import util = require('../lib/util');
import sampleBucket from './sample-bucket.json';
import sampleLakeformationAdminGroup from './sample-lakeformation-admin-group.json';

test('Bucket Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  const props = {
    content: 'log',
    description: 'logging',
    env: 'dev',
    label: 'log',
    log_bucket_name: '',
    owner: 'log',
    project: 'mywidget',
    security_level: '1',
    zone: 'log',
  };
  const bucket = new s3.Bucket(stack, 'MyTestBucket', props);
  // THEN
  expectCDK(stack).to(haveResource('AWS::S3::Bucket'));
  expectCDK(stack).toMatch(sampleBucket);
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
    project: 'mydataproj',
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
    project: 'mydataproj',
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
    project: 'SPTN',
    source: 'https://github.com',
  };
  const stack = new cdk.Stack(app, 'TestStack');
  util.tagStack(stack, TagProps);
  const props = {
    description: 'my lake group',
    env: 'dev',
    label: 'lfanalysts',
    owner: 'alfred smithee',
    project: 'mydataproj',
  };
  const group = new lakeformationAnalystGroup.LakeformationAnalystGroup(stack, props);

  // THEN
  expectCDK(stack).to(haveResource('AWS::IAM::Group'));
  // HOW TO test if tags have been applied?!
});
