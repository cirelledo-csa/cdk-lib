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
   * The Product owner
   * @attribute
   */
  owner: string;

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
    this.baseprops = props.baseprops;
    const build = this.baseprops.buildId ? this.baseprops.buildId : 'null';
    const creator = this.baseprops.createdBy ? this.baseprops.createdBy : 'null';
    const prefix = this.baseprops.tagPrefix ? this.baseprops.tagPrefix : 'ucop:';
    const source = this.baseprops.source ? this.baseprops.source : 'null';
    const version = this.baseprops.tagVersion ? this.baseprops.tagVersion : '0.1';
    cdk.Tag.add(scope, prefix + 'application', this.baseprops.application);
    cdk.Tag.add(scope, prefix + 'buildId', this.baseprops.buildId);
    cdk.Tag.add(scope, prefix + 'createdBy', creator);
    cdk.Tag.add(scope, prefix + 'environment', this.baseprops.environment);
    cdk.Tag.add(scope, prefix + 'group', this.baseprops.group);
    cdk.Tag.add(scope, prefix + 'owner', this.baseprops.owner);
    cdk.Tag.add(scope, prefix + 'source', source);
    cdk.Tag.add(scope, prefix + 'tagVersion', version);
  }
}
export function makeBrand() {
  return ' proudly built in Oakland, California with @ucop-acme/aws-infra';
}

export function makeStackName(props: IBaseProps) {
  return props.application + cap(props.environment) + cap(props.label);
}

export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

export function cap(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function makeExportName(props: IResourceProps) {
  return props.application + cap(props.environment) + cap(props.label) + cap(props.type);
}

export function makeResourceName(prefix: string, name: string, postfix: string, separator: string) {
  return prefix + separator + name + separator + postfix;
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
  //  console.info("git branch maps to  " + env_branch + " environment");
  return branch;
}

export function mapBranchToEnvironment() {
  try {
    const gitBranch = getGitBranch();
    // console.info("git branch is " + gitBranch);
    return translateBranchToEnvironment(gitBranch);
  } catch (error) {
    if (error.stderr.toString().startsWith('fatal')) {
      const envBranch: string = process.env.CODEPIPELINE_GIT_BRANCH_NAME || '';
      // console.log('error stderr to string is ' + error.stderr.toString()); // Holds the stderr output. Use `.toString()`.
      return translateBranchToEnvironment(envBranch);
    } else {
      // console.log('error status ' + error.status); // Might be 127 in your example.
      // console.log('error message ' + error.message); // Holds the message you typically want.
      // console.log('error stderr ' + error.stderr); // Holds the stderr output. Use `.toString()`.
      // console.log('error stdout ' + error.stdout);
    }
  }
  return '';
}
