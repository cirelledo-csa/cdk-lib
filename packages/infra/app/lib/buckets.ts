/**
 * first pass at creating a datalake
 * using this as a guide https://docs.aws.amazon.com/lake-formation/latest/dg/getting-started-cloudtrail-tutorial.html
 */

import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import util = require('../../lib/util');
import DataBucket = require('../../lib/s3');
import params from '../../test/config.json';

export interface ILabeledBucketProps {
  /**
   * bucket label, primary key to identify bucket
   * @attribute
   */
  label: string;
  /**
   * bucket label, primary key to identify bucket
   * @attribute
   */
  bucket: s3.Bucket;
}

export interface IBucketHash {
  [label: string]: s3.Bucket;
}

export class Buckets extends util.BaseStack {
  public readonly bucketsArnList: string[] = [];
  public readonly bucketsArnDict: IBucketHash = {};
  public readonly labeledBuckets: ILabeledBucketProps[] = [];
  constructor(scope: cdk.App, props: util.IBaseStackProps) {
    super(scope, props);

    // resources

    // buckets

    // Create S3 Buckets for the Data Lake

    // product Logging bucket

    const stackprops = {
      baseprops: props.baseprops,
      bucketprops: {
        content: 'log',
        description: 'application logging',
        label: 'logs',
        log_bucket_name: '',
        owner: props.baseprops.owner,
        security_level: '1',
        zone: 'log',
      },
    };

    const LoggingBucket = new DataBucket.Bucket(this, stackprops);

    // iterate through list of buckets

    const bucketList = params[`buckets`];
    const bucketDict: IBucketHash = {};

    for (const bucket of bucketList) {
      stackprops.bucketprops.content = bucket.content;
      stackprops.bucketprops.description = bucket.description;
      stackprops.bucketprops.label = bucket.label;
      stackprops.bucketprops.log_bucket_name = LoggingBucket.bucket.bucketName;
      stackprops.bucketprops.owner = bucket.owner;
      stackprops.bucketprops.security_level = bucket.security_level;
      stackprops.bucketprops.zone = bucket.zone;
      const lakeBucket = new DataBucket.Bucket(this, stackprops);
      this.bucketsArnList.push(lakeBucket.bucket.bucketArn);
      this.labeledBuckets.push({
        bucket: lakeBucket.bucket,
        label: bucket[`label`],
      });
      bucketDict[bucket[`label`]] = lakeBucket.bucket;
    }
  }
}
