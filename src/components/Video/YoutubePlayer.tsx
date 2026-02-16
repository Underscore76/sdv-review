import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { useTiming } from "../Providers/TimingProvider";
import SpeedButtons from "../RunView/SpeedButtons";
import FrameStepButtons from "../RunView/FrameStepButtons";
import MarkerButtons from "../RunView/MarkerButtons";
import FrameRateInput from "../RunView/FrameRateInput";
import { PlayerProps } from "./PlayerProps";

const HelpText =
  "Right click the video and select stats for nerds.\n" +
  "It's listed under 'Current / Optimal Res'\n" +
  "Structured as 'Width x Height @ FrameRate'";

export default function YoutubePlayer(props: PlayerProps) {
  const { uri, run } = props;
  const run_id = run.id;
  const { frameRate, setStart, setEnd } = useTiming();

  const ref = React.useRef<YouTube | null>(null);
  const [rates, setRates] = React.useState<number[] | null>(null);

  const url = new URL(uri);
  let video_id = "";
  video_id = url.searchParams.get("v") || "";
  if (url.origin.includes("youtu.be")) {
    video_id = url.pathname.substring(1);
  }
  // fix issue where youtube url includes a malformed timestamp query string
  video_id = video_id.split("?")[0];
  if (video_id === "") {
    return <div>Invalid YouTube URL</div>;
  }

  async function updateFrames(frames: number) {
    if (!ref.current) {
      return;
    }

    const player = ref.current.getInternalPlayer();
    if (!player || player === null) {
      return;
    }
    return player
      .pauseVideo()
      .then(() => player.getCurrentTime())
      .then((time) => {
        player.seekTo(Math.max(time + frames / frameRate, 0), true);
      });
  }

  const getCurrentTime = () => {
    if (!ref.current) {
      return;
    }

    const player = ref.current.getInternalPlayer();
    if (!player || player === null) {
      return;
    }

    return player.getCurrentTime();
  };

  const onStepFrames = (frames: number) => () => {
    updateFrames(frames);
  };

  const onSpeedUp = (rate: number) => () => {
    if (!ref.current) {
      return;
    }

    const player = ref.current.getInternalPlayer();
    if (!player || player === null) {
      return;
    }

    player.setPlaybackRate(rate);
  };

  const onReady: YouTubeProps["onReady"] = (event) => {
    event.target.mute();
    // NOTE: the type definition is wildly incorrect on some of the things that are supposed to be Promises
    setRates(event.target.getAvailablePlaybackRates() as unknown as number[]);
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

  return (
    <div className="flex">
      <div className="aspect-video w-full max-w-[960px]">
        <YouTube
          ref={ref}
          className="h-full w-full"
          videoId={video_id}
          id="yt-player"
          onReady={onReady}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              // https://developers.google.com/youtube/player_parameters
              autoplay: 1,
              enablejsapi: 1,
              rel: 0,
            },
          }}
        />
      </div>

      {/* Frame control buttons */}
      <FrameStepButtons onStepFrames={onStepFrames} />
      {/* Speed control buttons */}
      <SpeedButtons rates={rates || []} onSpeedUp={onSpeedUp} />

      {/* Push states */}
      <div className="flex-none items-center">
        <FrameRateInput key={"yt-" + video_id} helpText={HelpText} />
        <MarkerButtons
          onSetStart={onSetStart}
          onSetEnd={onSetEnd}
          video_uri={video_id}
          run_id={run_id}
          rules={run.rules}
        />
      </div>
    </div>
  );
}
