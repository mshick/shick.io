import { createMusicKit } from 'lib/musickit/musickit'
import { NextRequest } from 'next/server'

const musickitPrivateKey = process.env.MUSICKIT_PRIVATE_KEY.replace(
  /\\n/g,
  '\n'
)
const musickitKeyId = process.env.MUSICKIT_KEY_ID
const musickitTeamId = process.env.MUSICKIT_TEAM_ID
const musickitMusicUserToken = process.env.MUSICKIT_MUSIC_USER_TOKEN
const musickitRenewSecret = process.env.MUSICKIT_RENEW_SECRET

export const config = {
  runtime: 'experimental-edge'
}

export default async function handler(req: NextRequest) {
  const { searchParams, pathname } = new URL(req.url)
  const method = pathname.match(/([^\/]+)\/?$/)[1]

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
      if (searchParams.get('renewSecret') === musickitRenewSecret) {
        results = await musicKit.renewMusicUserToken()
      } else {
        results = { errors: [{ title: 'Invalid secret' }] }
        status = 401
      }
      break

    case 'recent-tracks':
    default:
      results = await musicKit.getRecentlyPlayedTracks({ limit: 5 })
  }

  return new Response(JSON.stringify(results), {
    status,
    headers: {
      'content-type': 'application/json'
    }
  })
}
