import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import util = require('../lib/util');

export class LakeformationAdminGroup extends cdk.Construct {
  public readonly group: iam.Group;
  public readonly role: iam.Role;
  constructor(parent: cdk.Construct, props: util.IBaseStackProps) {
    super(parent, util.makeStackName(props!.baseprops));

    // create workflow role

    const resourceName = 'WorkFlowRole';
    const workFlowRole = new iam.Role(this, resourceName, {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
    });
    this.role = workFlowRole;

    // output role arn
    const e1 = new cdk.CfnOutput(this, resourceName + 'Arn', {
      exportName: util.makeExportName({
        application: props.baseprops.application,
        buildId: props.baseprops.buildId,
        createdBy: props.baseprops.createdBy,
        description: props.baseprops.description,
        environment: props.baseprops.environment,
        group: props.baseprops.group,
        label: props.baseprops.label,
        owner: props.baseprops.owner,
        source: props.baseprops.source,
        type: resourceName + 'Arn',
      }),
      value: this.role.roleArn,
    });

    // output role name
    const e2 = new cdk.CfnOutput(this, resourceName + 'Name', {
      exportName: util.makeExportName({
        application: props.baseprops.application,
        buildId: props.baseprops.buildId,
        createdBy: props.baseprops.createdBy,
        description: props.baseprops.description,
        environment: props.baseprops.environment,
        group: props.baseprops.group,
        label: props.baseprops.label,
        owner: props.baseprops.owner,
        source: props.baseprops.source,
        type: resourceName + 'Name',
      }),
      value: this.role.roleName,
    });

    // add manage glue service role

    workFlowRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'));

    // create and add inline policy for lake formation

    const lakeFormationPolicy = new iam.PolicyStatement({
      actions: ['lakeformation:GetDataAccess', 'lakeformation:GrantPermissions'],
      effect: iam.Effect.ALLOW,
      resources: ['*'],
    });
    workFlowRole.addToPolicy(lakeFormationPolicy);

    // create and add inline policy to assume role

    const workFlowAssumePolicy = new iam.PolicyStatement({
      actions: ['iam:PassRole'],
      effect: iam.Effect.ALLOW,
      resources: [workFlowRole.roleArn],
    });
    workFlowRole.addToPolicy(workFlowAssumePolicy);

    // create admin policy statement
    const AdminDatalakeBasicPolicyStatement = new iam.PolicyStatement({
      actions: [
        'lakeformation:*',
        'cloudtrail:DescribeTrails',
        'cloudtrail:LookupEvents',
        'iam:PutRolePolicy',
        'iam:CreateServiceLinkedRole',
      ],
      effect: iam.Effect.ALLOW,
      resources: ['*'],
    });
    const AdminDatalakeNoPutPolicyStatement = new iam.PolicyStatement({
      actions: ['lakeformation:PutDataLakeSettings'],
      effect: iam.Effect.DENY,
      resources: ['*'],
    });
    const AdminDatalakePassRolePolicyStatement = new iam.PolicyStatement({
      actions: ['iam:PassRole'],
      effect: iam.Effect.ALLOW,
      resources: [workFlowRole.roleArn],
    });
    const group = new iam.Group(this, props.baseprops.label, {});
    this.group = group;
    group.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSGlueConsoleFullAccess'));
    group.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonAthenaFullAccess'));
    group.addToPolicy(AdminDatalakeBasicPolicyStatement);
    group.addToPolicy(AdminDatalakeNoPutPolicyStatement);
    group.addToPolicy(AdminDatalakePassRolePolicyStatement);
  }
}
