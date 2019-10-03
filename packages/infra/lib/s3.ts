import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import util = require('../lib/util');

export interface IBucketProps {
  /**
   * bucket content, hopefully infomative to humans.
   * should be constained to list of log, data, code, artifact, etc
   * @attribute
   */
  content: string;

  /**
   * bucket description, hopefully infomative to humans.
   * @attribute
   */
  description: string;

  /**
   * bucket environment.
   * @attribute
   */
  env: string;

  /**
   * bucket log destination.
   * @attribute
   */
  log_bucket_name: string;

  /**
   * The label applied to the bucket.
   * @attribute
   */
  label: string;

  /**
   * The owner of the bucket contents.
   * @attribute
   */
  owner: string;

  /**
   * The product using the bucket, aka app or service.
   * @attribute
   */
  product: string;

  /**
   * security level of the bucket, needs map to PII, etc
   * @attribute
   */
  security_level: string;

  /**
   * bucket zone, cd data lake useage
   * @attribute
   */
  zone: string;
}

export function tagBucket(cfnBucket: s3.CfnBucket, props: IBucketProps) {
  cfnBucket.addPropertyOverride('Tags', [
    { Key: 'Content', Value: props.content },
    { Key: 'Description', Value: props.description },
    { Key: 'Environment', Value: props.env },
    { Key: 'DataOwner', Value: props.owner },
    { Key: 'Product', Value: props.product },
    { Key: 'SecurityLevel', Value: props.security_level },
    { Key: 'Zone', Value: props.zone },
  ]);
}

export function setLogBucket(cfnBucket: s3.CfnBucket, props: IBucketProps) {
  cfnBucket.addPropertyOverride('LoggingConfiguration.DestinationBucketName', props.log_bucket_name);
}

export function enableLogBucket(cfnBucket: s3.CfnBucket) {
  cfnBucket.addPropertyOverride('AccessControl', 'LogDeliveryWrite');
}

export class Bucket extends cdk.Construct {
  public readonly bucket: s3.Bucket;
  constructor(scope: cdk.Construct, id: string, props: IBucketProps) {
    super(scope, id);

    // create a bucket resource with encryption and disable public access
    const getMeABucket = new s3.Bucket(this, 'Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.KMS_MANAGED,
    });

    this.bucket = getMeABucket;

    // configure bucket resource properties
    const cfnBucket = getMeABucket.node.defaultChild as s3.CfnBucket;
    tagBucket(cfnBucket, props);

    // if data bucket then log data bucket to logging bucket
    if (props.content.match('data')) {
      setLogBucket(cfnBucket, props);
    }

    // if log bucket then enable logging
    if (props.content.match('log')) {
      enableLogBucket(cfnBucket);
    }

    // output bucket name
    const e1 = new cdk.CfnOutput(this, 'BucketName', {
      exportName: util.makeExportName(props.env, props.label, props.product, 'BucketName'),
      value: getMeABucket.bucketName,
    });

    // output bucket arn
    const e2 = new cdk.CfnOutput(this, 'BucketArn', {
      exportName: util.makeExportName(props.env, props.label, props.product, 'BucketArn'),
      value: getMeABucket.bucketArn,
    });
  }
}
