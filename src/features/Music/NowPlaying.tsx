import useSWR from 'swr'
import { get } from 'utils/fetcher'

export function NowPlaying() {
  const { data: recentTracks } = useSWR(
    '/api/music/recent-tracks?limit=1&extend=meta,metadata,attributes.metadata=&include=meta,metadata&types=songs',
    get
  )
  // console.log({ recentTracks })
  return <div>NOW PLAYING</div>
}
