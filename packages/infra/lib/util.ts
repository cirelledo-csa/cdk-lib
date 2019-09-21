// functions

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
