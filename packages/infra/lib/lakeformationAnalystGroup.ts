import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import util = require('../lib/util');

export class LakeformationAnalystGroup extends cdk.Construct {
  public readonly group: iam.Group;
  constructor(parent: cdk.Construct, props: util.IBaseStackProps) {
    super(parent, util.makeStackName(props!.baseprops));

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
    const resourceName = 'AnalystGroup';
    const group = new iam.Group(this, resourceName, {});
    this.group = group;
    group.addToPolicy(PolicyStatement);
  }
}
