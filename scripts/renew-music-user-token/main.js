#!/usr/bin/env node
import parser from 'yargs-parser'

const defaultEnvVar = 'MUSICKIT_MUSIC_USER_TOKEN'
const defaultTarget = 'production'
const vercelApiBase = 'https://api.vercel.com'

const argv = parser(process.argv.slice(2), {
  boolean: ['debug'],
  configuration: {
    'boolean-negation': false
  }
})

/**
 * @param {{bearerToken: string; baseUrl: string}} params
 */
function getMusicUserToken({ bearerToken, baseUrl }) {
  return async () => {
    const url = new URL('/api/music/renew-token/', baseUrl)
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })

    const result = await response.json()
    return result['music-token']
  }
}

/**
 * @param {{bearerToken: string; baseUrl: string}} params
 */
function getEnvVarByKey({ bearerToken, baseUrl }) {
  /**
   * @param {{key: string}} params
   */
  return async ({ key }) => {
    const url = new URL('/v9/projects/shick-io/env?decrypt=true', baseUrl)
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })

    /**
     * @type {{envs: Array<{id: string; key: string; value: string}>}}
     */
    const result = await response.json()

    return result.envs.find((envVar) => envVar.key === key)
  }
}

/**
 * @param {{bearerToken: string; baseUrl: string}} params
 */
function updateEnvVar({ bearerToken, baseUrl }) {
  /**
   * @param {{id: string; value: string}} params
   */
  return async ({ id, value }) => {
    const url = new URL(`/v9/projects/shick-io/env/${id}`, baseUrl)
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${bearerToken}`
      },
      body: JSON.stringify({
        value
      })
    })

    return response.json()
  }
}

/**
 * @param {{bearerToken: string; baseUrl: string}} params
 */
function getLatestDeployment({ bearerToken, baseUrl }) {
  /**
   * @param {{target: string}} params
   */
  return async ({ target }) => {
    const url = new URL(`/v6/deployments?target=${target}&limit=1`, baseUrl)
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })

    const result = await response.json()
    return result.deployments[0]
  }
}

/**
 * @param {{bearerToken: string; baseUrl: string}} params
 */
function reploy({ bearerToken, baseUrl }) {
  /**
   * @param {{deployment: {name: string; meta: {githubOrg: string; githubRepo: string; githubCommitRef: string; githubCommitSha: string}}; target: string}} params
   * @returns {Promise<any>}
   */
  return async ({ deployment, target }) => {
    const url = new URL(`/v13/deployments?forceNew=1&withCache=1`, baseUrl)

    const { name, meta } = deployment
    const newDeployment = {
      target,
      name,
      gitSource: {
        type: 'github',
        org: meta.githubOrg,
        repo: meta.githubRepo,
        ref: meta.githubCommitRef,
        sha: meta.githubCommitSha
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${bearerToken}`
      },
      body: JSON.stringify(newDeployment)
    })

    return await response.json()
  }
}

/**
 * @param {{siteToken: string; siteUrl: string; vercelToken: string; vercelUrl: string}} params
 */
function getRequests({ siteToken, siteUrl, vercelToken, vercelUrl }) {
  return {
    getMusicUserToken: getMusicUserToken({
      bearerToken: siteToken,
      baseUrl: siteUrl
    }),
    getEnvVarByKey: getEnvVarByKey({
      bearerToken: vercelToken,
      baseUrl: vercelUrl
    }),
    updateEnvVar: updateEnvVar({
      bearerToken: vercelToken,
      baseUrl: vercelUrl
    }),
    getLatestDeployment: getLatestDeployment({
      bearerToken: vercelToken,
      baseUrl: vercelUrl
    }),
    reploy: reploy({
      bearerToken: vercelToken,
      baseUrl: vercelUrl
    })
  }
}

async function main() {
  const siteUrl = argv['site-url'] ?? process.env.SITE_URL
  const siteToken = argv['site-token'] ?? process.env.SITE_TOKEN
  const vercelToken = argv['vercel-token'] ?? process.env.VERCEL_TOKEN

  if (!siteUrl || !siteToken || !vercelToken) {
    console.error(
      'Missing variables: site-url, site-token and vercel-token are all required.'
    )
    process.exit(1)
  }

  const debug = argv['debug'] ?? process.env.DEBUG ?? false
  const envVarKey = argv['env-var'] ?? process.env.ENV_VAR_KEY ?? defaultEnvVar
  const target = argv['target'] ?? defaultTarget
  const noDeploy = argv['no-deploy'] ?? process.env.NO_DEPLOY ?? false

  const requests = getRequests({
    siteUrl,
    siteToken,
    vercelToken,
    vercelUrl: vercelApiBase
  })

  const musicUserToken = await requests.getMusicUserToken()

  // console.log({ musicUserToken })

  const envVar = await requests.getEnvVarByKey({ key: envVarKey })

  if (!envVar) {
    console.log('No envVar found')
    process.exit(0)
  }

  if (envVar.value === musicUserToken) {
    console.log('Token has not changed, renewal halted')
    process.exit(0)
  }

  if (noDeploy) {
    process.exit(0)
  }

  await requests.updateEnvVar({
    id: envVar.id,
    value: musicUserToken
  })

  const deployment = await requests.getLatestDeployment({
    target
  })

  const deploymentResult = await requests.reploy({
    deployment,
    target
  })

  if (debug) {
    console.debug(deploymentResult)
  }

  console.log(
    `Deployment is ${deploymentResult.status} on target ${deploymentResult.target}`
  )
  process.exit(0)
}

main()
