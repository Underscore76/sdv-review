import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import type { YouTubePlayer } from "react-youtube";
import { useTiming } from "../Providers/TimingProvider";
import SpeedButtons from "../RunView/SpeedButtons";
import FrameStepButtons from "../RunView/FrameStepButtons";
import MarkerButtons from "../RunView/MarkerButtons";
import FrameRateInput from "../RunView/FrameRateInput";
import { PlayerProps } from "./PlayerProps";
import Button from "../General/Button";
import { useVideoControls } from "../Providers/VideoControlProvider";
import type { Segment } from "../Providers/SegmentProvider";

const HelpText =
  "Right click the video and select stats for nerds.\n" +
  "It's listed under 'Current / Optimal Res'\n" +
  "Structured as 'Width x Height @ FrameRate'";

type YoutubeUrlInfo = {
  videoId: string;
  playlistId: string | null;
  startIndex: number | null;
};

function parseYoutubeUrl(uri: string): YoutubeUrlInfo | null {
  let url: URL;
  try {
    url = new URL(uri.trim());
  } catch {
    return null;
  }

  const playlistId = url.searchParams.get("list");
  const pathVideoId =
    url.pathname.match(/\/(?:embed|live|shorts)\/([^/?]+)/)?.[1] || "";

  let videoId = url.searchParams.get("v")?.substring(0, 11) || pathVideoId;
  if (url.hostname.includes("youtu.be")) {
    videoId = url.pathname.substring(1).split("/")[0];
  }

  // Some submitted links contain a malformed timestamp query string inside the ID.
  videoId = videoId.split("?")[0].split("&")[0];

  const rawIndex = Number(url.searchParams.get("index"));
  const startIndex =
    Number.isFinite(rawIndex) && rawIndex > 0 ? rawIndex - 1 : null;

  if (!videoId && !playlistId) {
    return null;
  }

  return { videoId, playlistId, startIndex };
}

function safeArray<T>(value: T[] | readonly T[] | null | undefined) {
  return value ? [...value] : [];
}

function getPlaylistSegmentIndex(segment?: Segment) {
  const [, rawVideoNumber] = segment?.video_uri.split(":") || [];
  const videoNumber = Number(rawVideoNumber);
  return Number.isInteger(videoNumber) && videoNumber > 0
    ? videoNumber - 1
    : null;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

async function waitForPlaylistIndex(
  player: YouTubePlayer,
  targetIndex: number,
) {
  for (let tries = 0; tries < 15; tries++) {
    const currentIndex = await player.getPlaylistIndex();
    if (currentIndex === targetIndex) {
      return;
    }
    await wait(150);
  }
}

export default function YoutubePlayer(props: PlayerProps) {
  const { uri, run, run_id } = props;
  const { frameRate, setStart, setEnd } = useTiming();
  const { setJumpToSegmentTime } = useVideoControls();
  const youtubeInfo = parseYoutubeUrl(uri);
  const isPlaylist = !!youtubeInfo?.playlistId;

  const ref = React.useRef<YouTube | null>(null);
  const currentPlaylistVideoRef = React.useRef("");

  const [rates, setRates] = React.useState<number[] | null>(null);
  const [playlist, setPlaylist] = React.useState<string[]>([]);
  const [playlistIndex, setPlaylistIndex] = React.useState(0);

  const getPlayer = React.useCallback((): YouTubePlayer | null => {
    return ref.current?.getInternalPlayer() || null;
  }, []);

  const clearMarkers = React.useCallback(() => {
    setStart(0);
    setEnd(0);
  }, [setEnd, setStart]);

  const syncPlaylistState = React.useCallback(async () => {
    const player = getPlayer();
    if (!player) {
      return null;
    }

    try {
      const currentTime = await player.getCurrentTime();

      if (!isPlaylist) {
        return { currentTime };
      }

      const [currentPlaylist, currentIndex] = await Promise.all([
        player.getPlaylist(),
        player.getPlaylistIndex(),
      ]);

      const nextPlaylist = safeArray(currentPlaylist);
      setPlaylist(nextPlaylist);
      setPlaylistIndex(currentIndex);

      const currentPlaylistVideo =
        nextPlaylist[currentIndex] ||
        youtubeInfo?.videoId ||
        `${youtubeInfo?.playlistId}:${currentIndex}`;
      if (
        currentPlaylistVideoRef.current &&
        currentPlaylistVideoRef.current !== currentPlaylistVideo
      ) {
        clearMarkers();
      }
      currentPlaylistVideoRef.current = currentPlaylistVideo;

      return {
        currentTime,
        playlistIndex: currentIndex,
      };
    } catch {
      return null;
    }
  }, [
    clearMarkers,
    getPlayer,
    isPlaylist,
    youtubeInfo?.playlistId,
    youtubeInfo?.videoId,
  ]);

  React.useEffect(() => {
    currentPlaylistVideoRef.current = "";
    setPlaylist([]);
    setPlaylistIndex(youtubeInfo?.startIndex || 0);
    clearMarkers();
  }, [clearMarkers, uri, youtubeInfo?.startIndex]);

  React.useEffect(() => {
    if (!isPlaylist) {
      return;
    }

    const intervalId = window.setInterval(() => {
      syncPlaylistState();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isPlaylist, syncPlaylistState]);

  const jumpToTime = React.useCallback(
    async (time: number, segment?: Segment) => {
      const player = getPlayer();
      if (!player) {
        return;
      }

      const targetPlaylistIndex = isPlaylist
        ? getPlaylistSegmentIndex(segment)
        : null;
      if (
        targetPlaylistIndex !== null &&
        targetPlaylistIndex !== playlistIndex
      ) {
        await player.playVideoAt(targetPlaylistIndex);
        await waitForPlaylistIndex(player, targetPlaylistIndex);
      }

      await player.pauseVideo();
      await player.seekTo(Math.max(time, 0), true);
      syncPlaylistState();
    },
    [getPlayer, isPlaylist, playlistIndex, syncPlaylistState],
  );

  React.useEffect(() => {
    setJumpToSegmentTime(jumpToTime);
    return () => setJumpToSegmentTime(null);
  }, [jumpToTime, setJumpToSegmentTime]);

  if (!youtubeInfo) {
    return <div>Invalid YouTube URL</div>;
  }

  async function updateFrames(frames: number) {
    const player = getPlayer();
    if (!player) {
      return;
    }

    await player.pauseVideo();
    const time = await player.getCurrentTime();
    await player.seekTo(Math.max(time + frames / frameRate, 0), true);
    syncPlaylistState();
  }

  async function jumpToCurrentVideoTime(time: number) {
    const player = getPlayer();
    if (!player) {
      return;
    }

    await player.pauseVideo();
    await player.seekTo(Math.max(time, 0), true);
    syncPlaylistState();
  }

  const getCurrentTime = async () => {
    const player = getPlayer();
    if (!player) {
      return;
    }

    const snapshot = await syncPlaylistState();
    if (snapshot) {
      return snapshot.currentTime;
    }

    return player.getCurrentTime();
  };

  const onStepFrames = (frames: number) => () => {
    updateFrames(frames);
  };

  const onSpeedUp = (rate: number) => () => {
    const player = getPlayer();
    if (!player) {
      return;
    }

    player.setPlaybackRate(rate);
  };

  const onPreviousVideo = () => {
    const player = getPlayer();
    if (!player) {
      return;
    }
    player.previousVideo().then(() => syncPlaylistState());
  };

  const onNextVideo = () => {
    const player = getPlayer();
    if (!player) {
      return;
    }
    player.nextVideo().then(() => syncPlaylistState());
  };

  const onReady: YouTubeProps["onReady"] = async (event) => {
    await Promise.resolve(event.target.mute());
    const playbackRates = await Promise.resolve(
      event.target.getAvailablePlaybackRates(),
    );
    setRates(safeArray(playbackRates));

    const player = getPlayer();
    if (player && youtubeInfo.playlistId) {
      if (!youtubeInfo.videoId || youtubeInfo.startIndex !== null) {
        await player.loadPlaylist({
          listType: "playlist",
          list: youtubeInfo.playlistId,
          index: youtubeInfo.startIndex || 0,
        });
      }
    }

    syncPlaylistState();
  };

  const onStateChange: YouTubeProps["onStateChange"] = () => {
    syncPlaylistState();
  };

  async function onSetStart() {
    const time = await getCurrentTime();
    if (time === undefined) {
      return;
    }
    setStart(time);
  }

  async function onSetEnd() {
    const time = await getCurrentTime();
    if (time === undefined) {
      return;
    }
    setEnd(time);
  }

  const currentPlaylistVideo =
    playlist[playlistIndex] ||
    youtubeInfo.videoId ||
    youtubeInfo.playlistId ||
    "";
  const markerVideoUri = youtubeInfo.playlistId
    ? `${youtubeInfo.playlistId}:${playlistIndex + 1}:${currentPlaylistVideo}`
    : youtubeInfo.videoId;
  const keyPrefix = youtubeInfo.playlistId || youtubeInfo.videoId;
  const playerVars: NonNullable<YouTubeProps["opts"]>["playerVars"] = {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
    enablejsapi: 1,
    rel: 0,
    ...(youtubeInfo.playlistId
      ? {
          list: youtubeInfo.playlistId,
          listType: "playlist",
        }
      : {}),
  };

  return (
    <div className="flex">
      <div className="aspect-video w-full max-w-[960px]">
        <YouTube
          ref={ref}
          className="h-full w-full"
          videoId={youtubeInfo.videoId}
          id="yt-player"
          onReady={onReady}
          onStateChange={onStateChange}
          opts={{
            width: "100%",
            height: "100%",
            playerVars,
          }}
        />
      </div>

      {/* Frame control buttons */}
      <FrameStepButtons onStepFrames={onStepFrames} />
      {/* Speed control buttons */}
      <SpeedButtons rates={rates || []} onSpeedUp={onSpeedUp} />

      {/* Push states */}
      <div className="flex-none items-center">
        <FrameRateInput key={"yt-" + keyPrefix} helpText={HelpText} />
        <MarkerButtons
          onSetStart={onSetStart}
          onSetEnd={onSetEnd}
          onJumpToTime={jumpToCurrentVideoTime}
          video_uri={markerVideoUri}
          run_id={run_id}
          rules={run?.rules}
          comment={run?.comment || undefined}
        />
        {isPlaylist && (
          <div className="flex w-60 flex-col items-center px-2 pt-2">
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              Playlist
            </h2>
            <div className="py-1 text-center text-sm">
              <div>
                {playlistIndex + 1}/{playlist.length || "?"}
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-2">
              <Button
                variant="gray"
                classNames="w-full !px-2 !py-2"
                onClick={onPreviousVideo}
              >
                Prev
              </Button>
              <Button
                variant="gray"
                classNames="w-full !px-2 !py-2"
                onClick={onNextVideo}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
