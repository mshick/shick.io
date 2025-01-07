'use client';

import { Popover } from '@headlessui/react';
import { ChevronUpIcon, PlayPauseIcon } from '@heroicons/react/24/solid';
import {
  Fragment,
  type MutableRefObject,
  useCallback,
  useRef,
  useState,
} from 'react';
import useSWR, { type Fetcher } from 'swr';
import { Loading } from '#/components/Loading';
import { FetchError } from '#/lib/errors';
import { classNames } from '#/lib/utils/classNames';

type Track = {
  id: string;
  href: string;
  attributes: {
    albumName: string;
    artistName: string;
    artwork: {
      width: number;
      height: number;
      url: string;
    };
    composerName: string;
    durationInMillis: number;
    genreName: string[];
    name: string;
    previews: {
      url: string;
    }[];
    releaseDate: string;
    trackNumber: number;
    url: string;
  };
};

type ListeningToTrackProps = {
  audio: MutableRefObject<HTMLAudioElement>;
  track: Track;
  isActiveTrack: boolean;
  onPlay: () => void;
};

const fetcher: Fetcher<Track[], string> = (limit) =>
  fetch(`/api/music/recent-tracks?limit=${limit}&types=songs`)
    .then((res) => Promise.all([res, res.json()]))
    .then(([res, body]) => {
      if (!res.ok) {
        throw new FetchError('An error occurred while fetching the data.', {
          info: body,
          status: res.status,
        });
      }

      return body.data;
    });

function ListeningToTrack({
  audio,
  onPlay,
  isActiveTrack,
  track: { attributes },
}: ListeningToTrackProps) {
  const { name, artistName, previews } = attributes;
  const [duration, setDuration] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const trackUrl = previews?.[0]?.url;

  const togglePlay = useCallback(() => {
    if (!trackUrl) {
      return;
    }

    if (!audio.current?.currentSrc || audio.current.currentSrc !== trackUrl) {
      if (audio.current) {
        audio.current.pause();
      }

      onPlay();

      audio.current = new Audio(trackUrl);

      audio.current.addEventListener('loadeddata', () => {
        setDuration(Math.ceil(audio.current.duration));
      });

      audio.current.addEventListener('timeupdate', () => {
        setElapsed(Math.floor(audio.current.currentTime));
      });

      void audio.current.play();
      return;
    }

    if (audio.current?.duration > 0 && !audio.current.paused) {
      audio.current.pause();
    } else {
      void audio.current.play();
    }
  }, [audio, onPlay, trackUrl]);

  return (
    <button
      type="button"
      className="w-full flex hover:bg-blue-700 hover:text-white p-2"
      onClick={togglePlay}
    >
      <div className="flex gap-2 flex-row items-center justify-center">
        {trackUrl && (
          <span className="cursor-pointer">
            <PlayPauseIcon className="w-4 h-4" />
          </span>
        )}

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
  );
}

export type ListeningToProps = {
  limit?: number;
};

export function ListeningToPopover({ limit }: ListeningToProps) {
  const { data: recentTracks, error: recentTracksError } = useSWR(
    String(limit ?? 10),
    fetcher,
    {
      refreshInterval: 60000,
    },
  );

  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement>(new Audio());

  if (recentTracksError) {
    return null;
  }

  if (!recentTracks) {
    return <Loading />;
  }

  const mostRecentTrack = recentTracks[0];
  const { name, artistName } = mostRecentTrack?.attributes ?? {};

  return (
    <Popover as={Fragment}>
      {({ open }) => (
        <div className="relative">
          <Popover.Button className="flex gap-2 text-sm max-w-[90%] group hover:bg-blue-700 hover:text-white">
            <div className="mr-2">♬♪♫</div>

            <div className="flex justify-between whitespace-nowrap overflow-x-hidden">
              <div className="relative">
                <span className="flex hover:animate-marquee">
                  {name} - {artistName}
                </span>
              </div>
            </div>

            <ChevronUpIcon
              className={classNames(
                open ? 'rotate-180 transform' : '',
                'h-5 w-5 text-black dark:text-white group-hover:text-white',
              )}
            />
          </Popover.Button>
          <Popover.Panel className="w-full absolute bottom-10 left-0 text-left dark:bg-black border-t-2 border-b-2 border-black dark:border-white bg-white py-4">
            <div className="font-bold mb-2 pl-2 uppercase text-sm">
              Recent listens <span>(courtesy of Apple Music)</span>
            </div>
            <ul>
              {recentTracks.map((track, trackIdx) => (
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
  );
}

export function ListeningTo() {
  return <ListeningToPopover />;
}
