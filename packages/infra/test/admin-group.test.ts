import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import lakeformationAdminGroup = require('../lib/lakeformationAdminGroup');
import util = require('../lib/util');
import params from './config.json';
import sampleLakeformationAdminGroup from './sample-lakeformation-admin-group.json';

const branchEnv = util.mapBranchToEnvironment().trim();

const baseprops = {
  buildUrl: 'nope',
  description: 'Stop Plate Tectonics Now',
  env: branchEnv,
  label: 'log',
  owner: 'alfred smithee',
  product: 'sptn',
  source: 'git',
};

test('Admin Group Created', () => {
  // WHEN
  const props = {
    buildUrl: 'haha',
    description: 'my lake group',
    env: 'dev',
    label: 'lfadmins',
    owner: 'alfred smithee',
    product: 'mydataproj',
    source: 'git',
  };
  const app = new cdk.App();
  const stack = new lakeformationAdminGroup.LakeformationAdminGroup(app, { baseprops });
  // THEN
  expectCDK(stack).toMatch(sampleLakeformationAdminGroup.junk);
  expectCDK(stack).to(haveResource('AWS::IAM::Group'));
});
