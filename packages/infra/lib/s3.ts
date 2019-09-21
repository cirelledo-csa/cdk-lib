import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import util = require('../lib/util');

export interface IBucketProps {
  content: string;
  description: string;
  env: string;
  log_bucket_name: string;
  label: string;
  owner: string;
  product: string;
  security_level: string;
  zone: string;
}

export class Bucket extends cdk.Construct {
  public readonly bucket: s3.Bucket;
  constructor(scope: cdk.Construct, id: string, props: IBucketProps) {
    super(scope, id);

    // create a bucket resource with encryption and disable public access
    const newBucket = new s3.Bucket(this, 'Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.KMS_MANAGED,
    });

    this.bucket = newBucket;

    // configure bucket resource properties
    const cfnBucket = newBucket.node.defaultChild as s3.CfnBucket;

    // add tags to bucket
    cfnBucket.addPropertyOverride('Tags', [
      { Key: 'Content', Value: props.content },
      { Key: 'Description', Value: props.description },
      { Key: 'Environment', Value: props.env },
      { Key: 'Owner', Value: props.owner },
      { Key: 'Product', Value: props.product },
      { Key: 'SecurityLevel', Value: props.security_level },
      { Key: 'Zone', Value: props.zone },
    ]);

    // if data bucket then log data bucket to logging bucket
    if (props.content.match('data')) {
      cfnBucket.addPropertyOverride('LoggingConfiguration.DestinationBucketName', props.log_bucket_name);
    }

    // if log bucket then enable logging
    if (props.content.match('log')) {
      cfnBucket.addPropertyOverride('AccessControl', 'LogDeliveryWrite');
    }

    // output bucket name
    const e1 = new cdk.CfnOutput(this, props.label + 'BucketName', {
      exportName: util.makeExportName(props.product, props.env, props.label, 'BucketName'),
      value: newBucket.bucketName,
    });

    // output bucket arn
    const e2 = new cdk.CfnOutput(this, props.label + 'BucketArn', {
      exportName: util.makeExportName(props.product, props.env, props.label, 'BucketArn'),
      value: newBucket.bucketArn,
    });
  }
}
