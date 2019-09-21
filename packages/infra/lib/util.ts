// functions

export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

export function cap(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function makeExportName(
  env: string,
  label: string,
  product: string,
  resource_type: string
) {
  var export_name = product + cap(env) + cap(label) + cap(resource_type);
  return export_name;
}

export function makeResourceName(
  prefix: string,
  name: string,
  postfix: string,
  separator: string
) {
  var resource_name = prefix + separator + name + separator + postfix;
  return resource_name;
}

export function mapBranchToEnvironment() {
  var env_branch: string = process.env.CODEPIPELINE_GIT_BRANCH_NAME || "";
  console.info("git branch is " + env_branch);
  if (env_branch.match("master")) {
    env_branch = "prod";
  }
  console.info("git branch maps to  " + env_branch + " environment");
  return env_branch;
}
