import cdk = require('@aws-cdk/core');
import { execSync } from 'child_process';

// functions

export interface IDefaultTags {
  /**
   * The application or service.
   * @attribute
   */
  application: string;

  /**
   * The app resource creator
   * @attribute
   */
  createdBy?: string;

  /**
   * The Product description.
   * @attribute
   */
  description: string;

  /**
   * The Product environment
   * @attribute
   */
  environment: string;

  /**
   * The Product Group
   * @attribute
   */
  group: string;

  /**
   * The tag prefix.
   * @attribute
   */
  tagPrefix?: string;

  /**
   * The tag version.
   * @attribute
   */
  tagVersion?: string;
}

export interface IResourceName {
  /**
   * The application or service.
   * @attribute
   */
  application: string;

  /**
   * Optional delimiter, default to .
   * @attribute
   */
  delim?: string;

  /**
   * The Product environment
   * @attribute
   */
  environment: string;

  /**
   * The Resource label
   * @attribute
   */
  resourceLabel: string;

  /**
   * The Resource type, eg ec2, bucket, lambda
   * @attribute
   */
  resourceType: string;
}

export function makeDelim(props: string | undefined) {
  const defaultDelim = '.';
  const delim = props || defaultDelim;
  return delim;
}

export function makeResourceName(props: IResourceName) {
  const delim = makeDelim(props.delim);
  return toLowerCase(
    props.application + delim + props.environment + delim + props.resourceLabel + delim + props.resourceType,
  );
}

export function makeExportName(props: IResourceName) {
  return props.application + cap(props.environment) + cap(props.resourceLabel) + cap(props.resourceType);
}

export interface IIACProps extends IDefaultTags {
  /**
   * build id, you're automating right?
   * @attribute
   */
  buildId: string;

  /**
   * source code
   * @attribute
   */
  source?: string;
}

export interface IBaseProps extends IIACProps {
  /**
   * The label applied to a stack, eg network, buckets, iam
   * @attribute
   */
  label: string;
}

export interface IBaseStackProps extends cdk.StackProps {
  /**
   * The base properties  extended to a Stack.
   * @attribute
   */
  readonly baseprops: IBaseProps;
}

export interface IResourceProps extends IBaseProps {
  /**
   * The type of Resource, eg vpc, ec2, securitygroup
   * @attribute
   */
  type: string;
}

// standard tagged iac stack
export class BaseStack extends cdk.Stack {
  protected readonly baseprops: IBaseProps;
  constructor(scope: cdk.Construct, props: IBaseStackProps) {
    super(scope, makeStackName(props!.baseprops), props);
  }
}

export function tagApp(app: cdk.App, props: IBaseStackProps) {
  const baseprops = props.baseprops;
  const build = baseprops.buildId ? baseprops.buildId : 'null';
  const creator = baseprops.createdBy ? baseprops.createdBy : 'null';
  const prefix = baseprops.tagPrefix ? baseprops.tagPrefix : 'ucop:';
  const source = baseprops.source ? baseprops.source : 'null';
  const version = baseprops.tagVersion ? baseprops.tagVersion : '0.2';
  cdk.Tag.add(app, prefix + 'application', baseprops.application);
  cdk.Tag.add(app, prefix + 'buildId', baseprops.buildId);
  cdk.Tag.add(app, prefix + 'createdBy', creator);
  cdk.Tag.add(app, prefix + 'environment', baseprops.environment);
  cdk.Tag.add(app, prefix + 'group', baseprops.group);
  cdk.Tag.add(app, prefix + 'source', source);
  cdk.Tag.add(app, prefix + 'tagVersion', version);
}

export function makeBrand() {
  return ' proudly built in Oakland, California with @ucop-acme/aws-infra';
}

export function makeStackName(props: IBaseProps) {
  return props.application + cap(props.environment) + cap(props.label);
}

export function toLowerCase(str: string): string {
  return str.toLowerCase();
}

export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

export function cap(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export default function getGitBranch() {
  const gitCommand: string = 'git rev-parse --abbrev-ref HEAD';
  // try{
  const r = execSync(gitCommand, { encoding: 'utf8' });
  return r;
}

export function translateBranchToEnvironment(branch: string) {
  if (branch.match('master')) {
    return 'prod';
  }
  return branch;
}

export function mapBranchToEnvironment() {
  try {
    const gitBranch = getGitBranch();
    return translateBranchToEnvironment(gitBranch);
  } catch (error) {
    if (error.stderr.toString().startsWith('fatal')) {
      const envBranch: string = process.env.CODEPIPELINE_GIT_BRANCH_NAME || '';
      return translateBranchToEnvironment(envBranch);
    }
  }
  return '';
}
