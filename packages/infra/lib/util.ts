import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
// functions

export interface IBaseProps {
  /**
   * The Project description.
   * @attribute
   */
  description: string;

  /**
   * The Project environment
   * @attribute
   */
  env: string;

  /**
   * The Project Owner
   * @attribute
   */
  owner: string;

  /**
   * The Project, aka app or service.
   * @attribute
   */
  project: string;
}

export interface IGroupProps extends IBaseProps {
  /**
   * The label applied to the group.
   * @attribute
   */
  label: string;
}

export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

export function cap(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function makeExportName(env: string, label: string, product: string, resourceType: string) {
  return product + cap(env) + cap(label) + cap(resourceType);
}

export function makeResourceName(prefix: string, name: string, postfix: string, separator: string) {
  return prefix + separator + name + separator + postfix;
}

export function mapBranchToEnvironment() {
  const envBranch: string = process.env.CODEPIPELINE_GIT_BRANCH_NAME || '';
  // console.info("git branch is " + env_branch);
  if (envBranch.match('master')) {
    return 'prod';
  }
  //  console.info("git branch maps to  " + env_branch + " environment");
  return envBranch;
}

export interface IStackTagsProps {
  /**
   * build url, you're automating right?
   * @attribute
   */
  buildUrl: string;

  /**
   * environment, eg dev/qa/prod
   * @attribute
   */
  env: string;

  /**
   * functional description, hopefully informative to humans.
   * @attribute
   */
  description: string;

  /**
   * project owner
   * @attribute
   */
  owner: string;

  /**
   * project name, main identification key
   * @attribute
   */
  project: string;

  /**
   * git repo project source
   * @attribute
   */
  source: string;
}

export function tagStack(stack: cdk.Stack, props: IStackTagsProps) {
  cdk.Tag.add(stack, 'BuildUrl', props.buildUrl);
  cdk.Tag.add(stack, 'Environment', props.env);
  cdk.Tag.add(stack, 'Description', props.description);
  cdk.Tag.add(stack, 'Owner', props.owner);
  cdk.Tag.add(stack, 'Project', props.project);
  cdk.Tag.add(stack, 'Source', props.source);
}
