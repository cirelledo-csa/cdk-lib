import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');

export interface IAnalystGroupProps {
  name: string;
}

export class LakeformationAnalystGroup extends cdk.Construct {
  public readonly group: iam.Group;
  constructor(parent: cdk.Construct, name: string, props: IAnalystGroupProps) {
    super(parent, name);

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
    const group = new iam.Group(this, props.name, {});
    this.group = group;
    group.addToPolicy(PolicyStatement);
  }
}
