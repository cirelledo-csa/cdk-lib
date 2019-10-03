# Why?
These are helper libraries to unify some of the basic stack operations in AWS.
Intended for use with codepipeline/codebuild

# Example useage of stack tagging

 ```ts
#!/usr/bin/env node
import cdk = require("@aws-cdk/core");
import infra = require("@ucop-acme/aws-infra");
import "source-map-support/register";
import config from "../config.json";
import { AppBase } from "../lib/app-base";

const app = new cdk.App();
const Infra = new AppBase(app, "Infra");
const tags = config[`tags`];

/**
 * get the CODEBUILD_BUILD_URL environment variable
 */
const codebuildUrl: string = process.env.CODEBUILD_BUILD_URL || "";

/**
 * create a IStackTagsProps dictionary
 */
const props: infra.IStackTagsProps = {
  buildUrl: codebuildUrl,
  description: tags.Description,
  env: infra.mapBranchToEnvironment(),
  owner: tags.Owner,
  product: tags.Product,
  source: "https://git-codecommit.us-west-2.amazonaws.com/v1/repos/stpn"
};

/**
 * tag stack with IStackTagsProps dictionary
 */
infra.tagStack(Infra, props);
 ```

 # Tags from json file:

 ```json
{
  "tags": {
    "Description": "Stop Plate Tectonics Now",
    "Owner": "alfred.smithee@google.com",
    "Product": "sptn"
  }
}
 ```

 # example of bucket creation
 ```ts
import infra = require("@ucop-acme/aws-infra");

    // product Logging bucket

    const LoggingBucket = new infra.Bucket(this, "log", {
      content: "log",
      description: "logging",
      env: envBranch,
      label: "log",
      log_bucket_name: "",
      owner: "log",
      product: params[`tags`][`Product`],
      security_level: "1",
      zone: "log"
    });
 ```
