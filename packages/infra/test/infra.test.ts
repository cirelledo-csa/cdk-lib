import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import lakeformationAdminGroup = require('../lib/lakeformationAdminGroup');
import lakeformationAnalystGroup = require('../lib/lakeformationAnalystGroup');
import s3 = require('../lib/s3');
import util = require('../lib/util');

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
    product: 'mywidget',
    security_level: '1',
    zone: 'log',
  };
  const bucket = new s3.Bucket(stack, 'MyTestBucket', props);
  // THEN
  expectCDK(stack).to(haveResource('AWS::S3::Bucket'));
});

test('Admin Group Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  const props = {
    name: 'admins',
  };
  const group = new lakeformationAdminGroup.AdminGroup(stack, 'MyTestGroup', props);
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
  const group = new lakeformationAnalystGroup.AnalystGroup(stack, 'MyTestGroup', props);
  // THEN
  expectCDK(stack).to(haveResource('AWS::IAM::Group'));
});
