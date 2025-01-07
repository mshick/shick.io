#!/usr/bin/env -S npx tsx

const defaultEnvVar = 'MUSICKIT_MUSIC_USER_TOKEN';
const defaultTarget = 'production';
const vercelApiBase = 'https://api.vercel.com';

type StringFlags = {
  'site-url'?: string;
  'site-token'?: string;
  'vercel-token'?: string;
  'vercel-project-name'?: string;
  target?: string;
  'env-var'?: string;
};

type BooleanFlags = {
  debug?: boolean;
  'no-deploy'?: boolean;
};

type Args = {
  _: string[];
} & StringFlags &
  BooleanFlags;

function getArgs(argv: string[]) {
  const args: Args = { _: [] };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === undefined) {
      break;
    }

    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');

      if (key === 'debug') {
        args[key] = true;
        continue;
      }

      if (key === 'no-deploy') {
        args[key] = true;
        continue;
      }

      if (key !== undefined) {
        args[key as keyof StringFlags] = value;
      }
    } else {
      args._.push(arg);
    }
  }

  return args;
}

function getMusicUserToken({
  bearerToken,
  baseUrl,
}: {
  bearerToken: string;
  baseUrl: string;
}) {
  return async () => {
    const url = new URL('/api/music/renew-token/', baseUrl);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get renew token');
    }

    const result = await response.json();
    return result['music-token'];
  };
}

type EnvVar = {
  type: string;
  value: string;
  target: string[];
  id: string;
  key: string;
};

function getEnvVarByKey({
  bearerToken,
  baseUrl,
  projectName,
}: {
  bearerToken: string;
  baseUrl: string;
  projectName: string;
}) {
  return async ({ key }: { key: string }) => {
    const envVarsUrl = new URL(`/v9/projects/${projectName}/env`, baseUrl);
    const envVarsResponse = await fetch(envVarsUrl, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    const envVarsResult: {
      envs: { id: string; key: string; value: string }[];
    } = await envVarsResponse.json();

    if (!Array.isArray(envVarsResult?.envs)) {
      throw new Error('invalid envVars response');
    }

    const envVar = envVarsResult.envs.find((envVar) => envVar.key === key);

    if (!envVar) {
      throw new Error(`envVar ${key} not found`);
    }

    const secretUrl = new URL(
      `/v1/projects/${projectName}/env/${envVar.id}`,
      baseUrl,
    );
    const secretResponse = await fetch(secretUrl, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    const secretResult: EnvVar = await secretResponse.json();

    if (secretResult?.key !== key) {
      throw new Error();
    }

    return secretResult;
  };
}

function updateEnvVar({
  bearerToken,
  baseUrl,
  projectName,
}: {
  bearerToken: string;
  baseUrl: string;
  projectName: string;
}) {
  return async ({ id, value }: { id: string; value: string }) => {
    const url = new URL(`/v9/projects/${projectName}/env/${id}`, baseUrl);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        value,
      }),
    });

    return response.json();
  };
}

function getLatestDeployment({
  bearerToken,
  baseUrl,
}: {
  bearerToken: string;
  baseUrl: string;
}) {
  return async ({ target }: { target: string }) => {
    const url = new URL(`/v6/deployments?target=${target}&limit=1`, baseUrl);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    const result = await response.json();
    return result.deployments[0];
  };
}

type DeploymentParams = {
  deployment: {
    name: string;
    meta: {
      githubOrg: string;
      githubRepo: string;
      githubCommitRef: string;
      githubCommitSha: string;
    };
  };
  target: string;
};

function reploy({
  bearerToken,
  baseUrl,
}: {
  bearerToken: string;
  baseUrl: string;
}) {
  return async ({ deployment, target }: DeploymentParams): Promise<any> => {
    const url = new URL('/v13/deployments?forceNew=1&withCache=1', baseUrl);

    const { name, meta } = deployment;
    const newDeployment = {
      target,
      name,
      gitSource: {
        type: 'github',
        org: meta.githubOrg,
        repo: meta.githubRepo,
        ref: meta.githubCommitRef,
        sha: meta.githubCommitSha,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(newDeployment),
    });

    return await response.json();
  };
}

function getRequests({
  projectName,
  siteToken,
  siteUrl,
  vercelToken,
  vercelUrl,
}: {
  projectName: string;
  siteToken: string;
  siteUrl: string;
  vercelToken: string;
  vercelUrl: string;
}) {
  return {
    getMusicUserToken: getMusicUserToken({
      bearerToken: siteToken,
      baseUrl: siteUrl,
    }),
    getEnvVarByKey: getEnvVarByKey({
      bearerToken: vercelToken,
      baseUrl: vercelUrl,
      projectName,
    }),
    updateEnvVar: updateEnvVar({
      bearerToken: vercelToken,
      baseUrl: vercelUrl,
      projectName,
    }),
    getLatestDeployment: getLatestDeployment({
      bearerToken: vercelToken,
      baseUrl: vercelUrl,
    }),
    reploy: reploy({
      bearerToken: vercelToken,
      baseUrl: vercelUrl,
    }),
  };
}

async function main() {
  const args = getArgs(process.argv);

  const siteUrl = args['site-url'] ?? process.env.SITE_URL;
  const siteToken = args['site-token'] ?? process.env.SITE_TOKEN;
  const vercelToken = args['vercel-token'] ?? process.env.VERCEL_TOKEN;
  const projectName =
    args['vercel-project-name'] ?? process.env.VERCEL_PROJECT_NAME;

  if (!siteUrl || !siteToken || !vercelToken || !projectName) {
    throw new Error(
      'Missing variables: site-url, site-token and vercel-token are all required.',
    );
  }

  const debug = args.debug ?? process.env.DEBUG ?? false;
  const envVarKey = args['env-var'] ?? process.env.ENV_VAR_KEY ?? defaultEnvVar;
  const target = args.target ?? defaultTarget;
  const noDeploy = args['no-deploy'] ?? process.env.NO_DEPLOY ?? false;

  const requests = getRequests({
    projectName,
    siteUrl,
    siteToken,
    vercelToken,
    vercelUrl: vercelApiBase,
  });

  const musicUserToken = await requests.getMusicUserToken();

  const envVar = await requests.getEnvVarByKey({ key: envVarKey });

  if (!envVar) {
    console.log('No envVar found');
    return;
  }

  if (envVar.value === musicUserToken) {
    console.log('Token has not changed, renewal halted');
    return;
  }

  console.log('Found a new music user token!');

  if (noDeploy) {
    return;
  }

  await requests.updateEnvVar({
    id: envVar.id,
    value: musicUserToken,
  });

  const deployment = await requests.getLatestDeployment({
    target,
  });

  const deploymentResult = await requests.reploy({
    deployment,
    target,
  });

  if (debug) {
    console.debug(deploymentResult);
  }

  console.log(
    `Deployment is ${deploymentResult.status} on target ${deploymentResult.target}`,
  );
}

main().then(
  () => {
    process.exit(0);
  },
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
