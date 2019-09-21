import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import Infra = require('../lib/index');
import s3 = require('../lib/s3');
import util = require('../lib/util');

test('SQS Queue Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  const sqsTestStack = new Infra.Infra(stack, 'MyTestConstruct');
  // THEN
  expectCDK(stack).to(haveResource('AWS::SQS::Queue'));
});

test('SNS Topic Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  const snsTestStack = new Infra.Infra(stack, 'MyTestConstruct');
  // THEN
  expectCDK(stack).to(haveResource('AWS::SNS::Topic'));
});

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
