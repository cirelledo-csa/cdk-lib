import cdk = require("@aws-cdk/core");
import s3 = require("@aws-cdk/aws-s3");
import util = require('../lib/util');

export interface BucketProps {
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
  constructor(scope: cdk.Construct, id: string, props: BucketProps) {
    super(scope, id);

    // create a bucket resource with encryption and disable public access
    let new_bucket = new s3.Bucket(this, "Bucket", {
      encryption: s3.BucketEncryption.KMS_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    this.bucket = new_bucket;

    // configure bucket resource properties
    let cfnBucket = new_bucket.node.defaultChild as s3.CfnBucket;

    //add tags to bucket
    cfnBucket.addPropertyOverride("Tags", [
      { Key: "Content", Value: props.content },
      { Key: "Description", Value: props.description },
      { Key: "Environment", Value: props.env },
      { Key: "Owner", Value: props.owner },
      { Key: "Product", Value: props.product },
      { Key: "SecurityLevel", Value: props.security_level },
      { Key: "Zone", Value: props.zone }
    ]);

    // if data bucket then log data bucket to logging bucket
    if (props.content.match("data")) {
      cfnBucket.addPropertyOverride(
        "LoggingConfiguration.DestinationBucketName",
        props.log_bucket_name
      );
    }

    // if log bucket then enable logging
    if (props.content.match("log")) {
      cfnBucket.addPropertyOverride("AccessControl", "LogDeliveryWrite");
    }

    // output bucket name
    new cdk.CfnOutput(this, props.label + "BucketName", {
      exportName: util.makeExportName(props.product, props.env, props.label,"BucketName"), 
      value: new_bucket.bucketName
    });

    // output bucket arn
    new cdk.CfnOutput(this, props.label + "BucketArn", {
      exportName: util.makeExportName(props.product, props.env, props.label,"BucketArn"), 
      value: new_bucket.bucketArn
    });
  }
}
