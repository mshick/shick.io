import { createMusicKit } from '#/lib/musickit/musickit'
import { NextRequest } from 'next/server'

const _musickitPrivateKey = process.env.MUSICKIT_PRIVATE_KEY ?? ''
const musickitPrivateKey = _musickitPrivateKey.replace(/\\n/g, '\n')
const musickitKeyId = process.env.MUSICKIT_KEY_ID
const musickitTeamId = process.env.MUSICKIT_TEAM_ID
const musickitMusicUserToken = process.env.MUSICKIT_MUSIC_USER_TOKEN
const apiSecret = process.env.API_SECRET

export const config = {
  runtime: 'experimental-edge'
}

export default async function handler(req: NextRequest) {
  const { pathname, searchParams } = new URL(req.url)
  const method = pathname.match(/([^/]+)\/?$/)?.[1]

  if (!musickitMusicUserToken || !musickitTeamId || !musickitKeyId) {
    return new Response(
      JSON.stringify({ errors: [{ title: 'Not configured' }] }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json'
        }
      }
    )
  }

  const musicKit = await createMusicKit({
    musicUserToken: musickitMusicUserToken,
    privateKey: musickitPrivateKey,
    teamId: musickitTeamId,
    keyId: musickitKeyId
  })

  let results
  let status = 200

  switch (method) {
    case 'renew-token':
      if (req.headers.get('authorization') === `Bearer ${apiSecret}`) {
        results = await musicKit.renewMusicUserToken()
        if (results.error) {
          status = 500
          results = {
            errors: [
              { title: results.error, message: results.error_description }
            ]
          }
        }
      } else {
        results = { errors: [{ title: 'Unauthorized' }] }
        status = 401
      }
      break

    case 'recent-tracks':
      results = await musicKit.getRecentlyPlayedTracks(
        Object.fromEntries(searchParams)
      )
      if (results.errors) {
        status = 500
      }
      break

    case 'heavy-rotation':
      results = await musicKit.getHeavyRotationContent(
        Object.fromEntries(searchParams)
      )
      if (results.errors) {
        status = 500
      }
      break

    case 'recently-added':
      results = await musicKit.getRecentlyAddedResources(
        Object.fromEntries(searchParams)
      )
      if (results.errors) {
        status = 500
      }
      break

    default:
      results = { errors: [{ title: 'Not found' }] }
      status = 404
  }

  return new Response(JSON.stringify(results), {
    status,
    headers: {
      'content-type': 'application/json'
    }
  })
}
