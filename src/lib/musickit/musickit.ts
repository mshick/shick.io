import { createJwt, JwtCredentials } from './jwt'

const baseUrl = 'https://api.music.apple.com/v1/me'
const renewUrl =
  'https://play.itunes.apple.com/WebObjects/MZPlay.woa/wa/renewMusicToken'

type RequestContext = {
  developerToken: string
  musicUserToken: string
}

type GetRecentlyPlayedTracksParams = {
  limit?: number
  offset?: number
  types?: 'library-music-videos' | 'library-songs' | 'music-videos' | 'songs'
}

function getRecentlyPlayedTracks({
  developerToken,
  musicUserToken
}: RequestContext) {
  return async ({ limit, offset, types }: GetRecentlyPlayedTracksParams) => {
    const searchParams = new URLSearchParams([
      ['limit', String(limit ?? 10)],
      ['offset', String(offset ?? 0)],
      ['types', types ?? 'songs']
    ])

    const response = await fetch(
      `${baseUrl}/recent/played/tracks?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${developerToken}`,
          'Music-User-Token': musicUserToken
        }
      }
    )

    return response.json()
  }
}

function renewMusicUserToken({
  developerToken,
  musicUserToken
}: RequestContext) {
  return async () => {
    const response = await fetch(renewUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${developerToken}`,
        'Music-User-Token': musicUserToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    return response.json()
  }
}

export type CreateMusicKitOptions = JwtCredentials & {
  musicUserToken: string
}

export async function createMusicKit({
  musicUserToken,
  ...credentials
}: CreateMusicKitOptions) {
  const developerToken = await createJwt(credentials)
  const requestContext = {
    developerToken,
    musicUserToken
  }

  return {
    getRecentlyPlayedTracks: getRecentlyPlayedTracks(requestContext),
    renewMusicUserToken: renewMusicUserToken(requestContext)
  }
}
