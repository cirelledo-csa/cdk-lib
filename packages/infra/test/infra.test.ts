import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
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
