import { type DeveloperKeyCredentials, createDeveloperKey } from './jwt';

const baseUrl = 'https://api.music.apple.com';
const renewUrl =
  'https://play.itunes.apple.com/WebObjects/MZPlay.woa/wa/renewMusicToken';

type RequestContext = {
  developerToken: string;
  musicUserToken: string;
};

type PaginatedResult = {
  errors?: [{ title: string }];
  next?: string;
  data: Record<string, unknown>[];
};

type PaginationParams = {
  limit?: number | string;
  offset?: number | string;
};

type GetRecentlyPlayedTracksParams = PaginationParams & {
  types?: 'library-music-videos' | 'library-songs' | 'music-videos' | 'songs';
};

function getRecentlyPlayedTracks({
  developerToken,
  musicUserToken,
}: RequestContext) {
  return async ({ limit, offset, types }: GetRecentlyPlayedTracksParams) => {
    const searchParams = new URLSearchParams({
      limit: String(limit ?? 10),
      offset: String(offset ?? 0),
      types: types ?? 'songs',
      // ...params
    });

    const url = new URL(
      `/v1/me/recent/played/tracks?${searchParams.toString()}`,
      baseUrl,
    );

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${developerToken}`,
        'Music-User-Token': musicUserToken,
      },
    });

    const result = (await response.json()) as PaginatedResult;

    return {
      ...result,
      next: result?.next?.replace(
        '/v1/me/recent/played/tracks',
        '/api/music/recent-tracks',
      ),
    };
  };
}

type GetHeavyRotationContentParams = PaginationParams;

function getHeavyRotationContent({
  developerToken,
  musicUserToken,
}: RequestContext) {
  return async ({ limit, offset }: GetHeavyRotationContentParams) => {
    const searchParams = new URLSearchParams({
      limit: String(limit ?? 10),
      offset: String(offset ?? 0),
      // ...params
    });

    const url = new URL(
      `/v1/me/history/heavy-rotation?${searchParams.toString()}`,
      baseUrl,
    );

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${developerToken}`,
        'Music-User-Token': musicUserToken,
      },
    });

    const result = (await response.json()) as PaginatedResult;

    return {
      ...result,
      next: result?.next?.replace('/v1/me/history/', '/api/music/'),
    };
  };
}

type GetRecentlyAddedResourcesParams = PaginationParams;

function getRecentlyAddedResources({
  developerToken,
  musicUserToken,
}: RequestContext) {
  return async ({ limit, offset }: GetRecentlyAddedResourcesParams) => {
    const searchParams = new URLSearchParams({
      limit: String(limit ?? 10),
      offset: String(offset ?? 0),
      // ...params
    });

    const url = new URL(
      `/v1/me/library/recently-added?${searchParams.toString()}`,
      baseUrl,
    );

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${developerToken}`,
        'Music-User-Token': musicUserToken,
      },
    });

    const result = (await response.json()) as PaginatedResult;

    return {
      ...result,
      next: result?.next?.replace('/v1/me/library/', '/api/music/'),
    };
  };
}

function renewMusicUserToken({
  developerToken,
  musicUserToken,
}: RequestContext) {
  return async (): Promise<{
    'music-token': string;
    error?: string;
    error_description?: string;
  }> => {
    const response = await fetch(renewUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${developerToken}`,
        'X-Apple-Music-User-Token': musicUserToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return response.json();
  };
}

export type CreateMusicKitOptions = DeveloperKeyCredentials & {
  musicUserToken: string;
};

export async function createMusicKit({
  musicUserToken,
  ...credentials
}: CreateMusicKitOptions) {
  const developerToken = await createDeveloperKey(credentials);

  const requestContext = {
    developerToken,
    musicUserToken,
  };

  return {
    getRecentlyPlayedTracks: getRecentlyPlayedTracks(requestContext),
    renewMusicUserToken: renewMusicUserToken(requestContext),
    getHeavyRotationContent: getHeavyRotationContent(requestContext),
    getRecentlyAddedResources: getRecentlyAddedResources(requestContext),
  };
}
