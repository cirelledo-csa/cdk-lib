import cdk = require('@aws-cdk/core');
import { execSync } from 'child_process';

// functions

export interface IMyNameTags {
  foo: string;
  bar: string;
  name: string;
}

export interface ICostProps {
  /**
   * The Product environment
   * @attribute
   */
  env: string;

  /**
   * The Product Owner
   * @attribute
   */
  owner: string;

  /**
   * The Product, aka app or service.
   * @attribute
   */
  product: string;
}

export interface IDefaultProps {
  /**
   * The Product description.
   * @attribute
   */
  description: string;

  /**
   * The Product environment
   * @attribute
   */
  env: string;

  /**
   * The Product Owner
   * @attribute
   */
  owner: string;

  /**
   * The Product, aka app or service.
   * @attribute
   */
  product: string;
}

export interface IIACProps extends IDefaultProps {
  /**
   * build url, you're automating right?
   * @attribute
   */
  buildUrl: string;

  /**
   * git repo product source
   * @attribute
   */
  source: string;
}

export interface IBaseProps extends IIACProps {
  /**
   * The label applied to a stack, eg network, buckets, iam
   * @attribute
   */
  label: string;
  readonly costprops: ICostProps;
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
  protected readonly costprops: ICostProps;
  constructor(scope: cdk.Construct, props: IBaseStackProps) {
    super(scope, makeStackName(props!.baseprops), props);
    this.baseprops = props.baseprops;
    cdk.Tag.add(scope, 'buildUrl', this.baseprops.buildUrl);
    cdk.Tag.add(scope, 'env', this.baseprops.env);
    cdk.Tag.add(scope, 'owner', this.baseprops.owner);
    cdk.Tag.add(scope, 'product', this.baseprops.product);
    cdk.Tag.add(scope, 'source', this.baseprops.source);
    cdk.Tag.add(scope, 'cost:env', props.baseprops.costprops.env);
    cdk.Tag.add(scope, 'cost:owner', props.baseprops.costprops.owner);
    cdk.Tag.add(scope, 'cost:product', props.baseprops.costprops.product);
  }
}
export function makeBrand() {
  return ' proudly built in Oakland, California with @ucop-acme/aws-infra';
}

export function makeStackName(props: IBaseProps) {
  return props.product + cap(props.env) + cap(props.label);
}

export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

export function cap(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function makeExportName(props: IResourceProps) {
  return props.product + cap(props.env) + cap(props.label) + cap(props.type);
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
