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
