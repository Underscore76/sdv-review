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
  const { uri, run_id } = props;
  const { frameRate, setStart, setEnd } = useTiming();

  const ref = React.useRef<YouTube | null>(null);
  const [rates, setRates] = React.useState<number[] | null>(null);

  let video_id = "";
  if (uri.includes("youtu.be")) {
    video_id = uri.split("/").pop() || "";
    video_id = video_id.split("?")[0];
  } else {
    const url = new URL(uri);
    video_id = url.searchParams.get("v") || "";
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
    console.log(frameRate);
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
      <YouTube
        ref={ref}
        videoId={video_id}
        id="yt-player"
        onReady={onReady}
        opts={{
          playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
            enablejsapi: 1,
            rel: 0,
          },
        }}
      />

      {/* Frame control buttons */}
      <FrameStepButtons onStepFrames={onStepFrames} />
      {/* Speed control buttons */}
      <SpeedButtons rates={rates || []} onSpeedUp={onSpeedUp} />

      {/* Push states */}
      <div className="flex-none items-center">
        <FrameRateInput helpText={HelpText} />
        <MarkerButtons
          onSetStart={onSetStart}
          onSetEnd={onSetEnd}
          video_uri={video_id}
          run_id={run_id}
        />
      </div>
    </div>
  );
}
