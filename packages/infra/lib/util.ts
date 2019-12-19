import cdk = require('@aws-cdk/core');
import { execSync } from 'child_process';

// functions

export interface IBaseProps {
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

export interface IGroupProps extends IBaseProps {
  /**
   * The label applied to the group.
   * @attribute
   */
  label: string;
}

export interface IStackProps extends IBaseProps {
  /**
   * The label applied to the Stack.
   * @attribute
   */
  label: string;
}

export interface IResourceProps extends IStackProps {
  /**
   * The type of Resource
   * @attribute
   */
  type: string;
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

export function makeStackName(props: IStackProps) {
  return props.product + cap(props.env) + cap(props.label);
}

export default function getGitBranch() {
  const gitCommand: string = 'git rev-parse --abbrev-ref HEAD';
  // try{
  return execSync(gitCommand, { encoding: 'utf8' });
  // }
  // catch (error) {
  // else{
  //   console.log("error status " + error.status);  // Might be 127 in your example.
  // console.log("error message " + error.message); // Holds the message you typically want.
  // console.log("error stderr " + error.stderr);  // Holds the stderr output. Use `.toString()`.
  // console.log("error stdout " + error.stdout);
  // }
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
   * product owner
   * @attribute
   */
  owner: string;

  /**
   * product name, main identification key
   * @attribute
   */
  product: string;

  /**
   * git repo product source
   * @attribute
   */
  source: string;
}

export function tagStack(stack: cdk.Stack, props: IStackTagsProps) {
  cdk.Tag.add(stack, 'BuildUrl', props.buildUrl);
  cdk.Tag.add(stack, 'Environment', props.env);
  cdk.Tag.add(stack, 'Description', props.description);
  cdk.Tag.add(stack, 'Owner', props.owner);
  cdk.Tag.add(stack, 'Product', props.product);
  cdk.Tag.add(stack, 'Source', props.source);
}

// https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html#tag-restrictions
// letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.
// export function tagValidate(tag: string) {}
