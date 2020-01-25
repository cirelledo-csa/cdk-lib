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
   * bucket description, hopefully informative to humans.
   * @attribute
   */
  description: string;

  /**
   * bucket log destination.
   * @attribute
   */
  label: string;

  /**
   * bucket label, primary key
   * @attribute
   */
  log_bucket_name: string;

  /**
   * owner of bucket data.
   * @attribute
   */
  owner: string;

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

export interface IBucketStackProps extends util.IBaseStackProps {
  /**
   * The label applied to the Stack.
   * @attribute
   */
  bucketprops: IBucketProps;
}

export function tagBucket(cfnBucket: s3.CfnBucket, props: IBucketProps) {
  cfnBucket.addPropertyOverride('Tags', [
    { Key: 'Content', Value: props.content },
    { Key: 'Description', Value: props.description },
    { Key: 'DataOwner', Value: props.owner },
    { Key: 'Label', Value: props.label },
    { Key: 'Logging', Value: props.log_bucket_name },
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
  constructor(scope: cdk.Construct, props: IBucketStackProps) {
    const constructName = util.cap(props.bucketprops.label);
    super(scope, constructName);

    // create a bucket resource with encryption and disable public access
    const resourceName = util.cap(props.bucketprops.label);
    const getMeABucket = new s3.Bucket(this, 'Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.KMS_MANAGED,
    });

    this.bucket = getMeABucket;

    // configure bucket resource properties
    const cfnBucket = getMeABucket.node.defaultChild as s3.CfnBucket;
    tagBucket(cfnBucket, props.bucketprops);

    // if data bucket then log data bucket to logging bucket
    if (props.bucketprops.content.match('data')) {
      setLogBucket(cfnBucket, props.bucketprops);
    }

    // if log bucket then enable logging
    if (props.bucketprops.content.match('log')) {
      enableLogBucket(cfnBucket);
    }

    // output bucket name
    const e1 = new cdk.CfnOutput(this, 'BucketName', {
      exportName: util.makeExportName({
        buildUrl: props.baseprops.buildUrl,
        description: props.baseprops.description,
        env: props.baseprops.env,
        label: props.baseprops.label,
        owner: props.baseprops.owner,
        product: props.baseprops.product,
        source: props.baseprops.source,
        type: resourceName + 'BucketName',
      }),
      value: getMeABucket.bucketName,
    });

    // output bucket arn
    const e2 = new cdk.CfnOutput(this, 'BucketArn', {
      exportName: util.makeExportName({
        buildUrl: props.baseprops.buildUrl,
        description: props.baseprops.description,
        env: props.baseprops.env,
        label: props.baseprops.label,
        owner: props.baseprops.owner,
        product: props.baseprops.product,
        source: props.baseprops.source,
        type: resourceName + 'BucketArn',
      }),
      value: getMeABucket.bucketArn,
    });
  }
}
