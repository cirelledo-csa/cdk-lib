import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import lakeformationAdminGroup = require('../lib/lakeformationAdminGroup');
import lakeformationAnalystGroup = require('../lib/lakeformationAnalystGroup');
import s3 = require('../lib/s3');
import util = require('../lib/util');
import sample from './sample-bucket.json';

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
  expectCDK(stack).toMatch(sample);
});

test('Admin Group Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  const props = {
    name: 'admins',
  };
  const group = new lakeformationAdminGroup.LakeformationAdminGroup(stack, 'MyTestGroup', props);
  // THEN
  expectCDK(stack).to(haveResource('AWS::IAM::Group'));
});

test('Analyst Group Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  const props = {
    name: 'analysts',
  };
  const group = new lakeformationAnalystGroup.LakeformationAnalystGroup(stack, 'MyTestGroup', props);
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
    name: 'analysts',
  };
  const group = new lakeformationAnalystGroup.LakeformationAnalystGroup(stack, 'MyTestGroup', props);

  // THEN
  expectCDK(stack).to(haveResource('AWS::IAM::Group'));
  // HOW TO test if tags have been applied?!
});
