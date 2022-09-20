import { Popover } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import Loading from 'components/Loading'
import {
  Fragment,
  MutableRefObject,
  useCallback,
  useRef,
  useState
} from 'react'
import useSWR from 'swr'
import { get } from 'utils/fetcher'

type Track = {
  id: string
  href: string
  attributes: {
    albumName: string
    artistName: string
    artwork: {
      width: number
      height: number
      url: string
    }
    composerName: string
    durationInMillis: number
    genreName: string[]
    name: string
    previews: {
      url
    }[]
    releaseDate: string
    trackNumber: number
    url: string
  }
}

type ListeningToTrackProps = {
  audio: MutableRefObject<HTMLAudioElement>
  track: Track
  isActiveTrack: boolean
  onPlay: () => void
}

function ListeningToTrack({
  audio,
  onPlay,
  isActiveTrack,
  track: { attributes }
}: ListeningToTrackProps) {
  const { name, artistName, previews } = attributes
  const [duration, setDuration] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const trackUrl = previews?.[0]?.url

  const togglePlay = useCallback(() => {
    if (!trackUrl) {
      return
    }

    if (!audio.current?.currentSrc || audio.current.currentSrc !== trackUrl) {
      if (audio.current) {
        audio.current.pause()
      }

      onPlay()

      audio.current = new Audio(trackUrl)

      audio.current.addEventListener('loadeddata', () => {
        setDuration(Math.ceil(audio.current.duration))
      })

      audio.current.addEventListener('timeupdate', () => {
        setElapsed(Math.floor(audio.current.currentTime))
      })

      audio.current.play()
      return
    }

    if (audio.current?.duration > 0 && !audio.current.paused) {
      audio.current.pause()
    } else {
      audio.current.play()
    }
  }, [audio, onPlay, trackUrl])

  return (
    <button
      className="w-full flex hover:bg-blue-700 hover:text-white p-2"
      onClick={togglePlay}
    >
      <div className="flex gap-2">
        {trackUrl && <span className="cursor-pointer">⏯</span>}

        <span className="text-left">
          {name} by {artistName}
        </span>
      </div>

      <div className="ml-auto w-12">
        {isActiveTrack && duration !== 0 && (
          <span>
            {elapsed}/{duration}
          </span>
        )}
      </div>
    </button>
  )
}

export type ListeningToProps = {
  limit?: number
}

export function ListeningTo({ limit }: ListeningToProps) {
  const { data: recentTracks, error: recentTracksError } = useSWR(
    `/api/music/recent-tracks?limit=${limit ?? 10}&types=songs`,
    get,
    { refreshInterval: 60000 }
  )

  const [activeTrackId, setActiveTrackId] = useState(null)
  const audio = useRef<HTMLAudioElement>()

  if (recentTracksError) {
    return null
  }

  if (!recentTracks) {
    return <Loading />
  }

  const tracks = recentTracks.data
  const mostRecentTrack = tracks[0]
  const { name, artistName } = mostRecentTrack.attributes

  return (
    <Popover as={Fragment}>
      {({ open }) => (
        <div className="relative">
          <Popover.Button className="flex gap-2 text-sm max-w-[90%]">
            <div className="mr-2">♬♪♫</div>

            <div className="flex justify-between whitespace-nowrap overflow-x-hidden">
              <div className="relative">
                <span className="flex hover:animate-marquee">
                  {name} - {artistName}
                </span>
              </div>
            </div>

            <ChevronUpIcon
              className={`${
                open ? 'rotate-180 transform' : ''
              } h-5 w-5 text-black dark:text-white`}
            />
          </Popover.Button>
          <Popover.Panel className="w-full absolute bottom-10 left-0 text-left dark:bg-black border-t-2 border-b-2 border-black dark:border-white bg-white py-4">
            <div className="font-bold mb-2 pl-2 uppercase text-sm">
              Recent listens <span>(courtesy of Apple Music)</span>
            </div>
            <ul>
              {tracks.map((track, trackIdx) => (
                <li key={`${track.id}_${trackIdx}`}>
                  <ListeningToTrack
                    audio={audio}
                    track={track}
                    isActiveTrack={track.id === activeTrackId}
                    onPlay={() => setActiveTrackId(track.id)}
                  />
                </li>
              ))}
            </ul>
          </Popover.Panel>
        </div>
      )}
    </Popover>
  )
}
