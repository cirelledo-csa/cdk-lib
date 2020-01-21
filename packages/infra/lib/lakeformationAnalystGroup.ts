import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import util = require('../lib/util');

export class LakeformationAnalystGroup extends util.BaseStack {
  public readonly group: iam.Group;
  constructor(parent: cdk.Construct, props: util.IBaseStackProps) {
    super(parent, props);

    // create analyst role
    const PolicyStatement = new iam.PolicyStatement({
      actions: [
        'lakeformation:GetDataAccess',
        'glue:GetTable',
        'glue:GetTables',
        'glue:SearchTables',
        'glue:GetDatabase',
        'glue:GetDatabases',
        'glue:GetPartitions',
      ],
      effect: iam.Effect.ALLOW,
      resources: ['*'],
    });
    const group = new iam.Group(this, props.baseprops.label, {});
    this.group = group;
    group.addToPolicy(PolicyStatement);
  }
}
