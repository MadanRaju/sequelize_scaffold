const { testExecutor } = require('pm-api-test-runner');
const util = require('util');

const postmantCollectionPath = `${__dirname}/postmanCollections`;

const evironmentJson = {
  local: `${postmantCollectionPath}/environment/local_env.json`,
  dev: `${postmantCollectionPath}/environment/dev_env.json`,
  qa: `${postmantCollectionPath}/environment/qa_env.json`,
  stg: `${postmantCollectionPath}/environment/stg_env.json`,
};

if (util.isNullOrUndefined(process.env.NODE_ENV)
    || !util.isString(process.env.NODE_ENV)
    || util.isNullOrUndefined(evironmentJson[process.env.NODE_ENV.toLowerCase()])) {
  throw new Error('NODE_ENV has not been set to Local, Dev, QA or Stg');
} else {
  const environmentSettings = evironmentJson[process.env.NODE_ENV.toLowerCase()];
  const testParams = {
    testCollectionsFolderPath: `${postmantCollectionPath}/tests`,
    globalJSONPath: `${postmantCollectionPath}/environment/global_settings.json`,
    environmentJSONPath: `${environmentSettings}`,
  };

  testExecutor(testParams).catch((error) => {
    console.log(error);
    process.exit(1);
  });
}
