import React from "react";
import ReactPlayer from "react-player";
import { PlayerProps } from "./PlayerProps";
import FrameStepButtons from "../RunView/FrameStepButtons";
import FrameRateInput from "../RunView/FrameRateInput";
import MarkerButtons from "../RunView/MarkerButtons";
import { useTiming } from "../Providers/TimingProvider";

const HelpText =
  "Let the video run.\n" +
  "Click the Gear Icon.\n" +
  "Click Advanced.\n" +
  "Toggle Video Stats.\n";

export default function TwitchPlayer(props: PlayerProps) {
  const { uri, run_id } = props;
  const { frameRate, setStart, setEnd } = useTiming();
  const ref = React.useRef<ReactPlayer | null>(null);

  let video_id = "";
  if (uri.includes("twitch.tv")) {
    video_id = uri.split("/").pop() || "";
  } else {
    return <div>Invalid Twitch URL</div>;
  }

  async function updateFrames(frames: number) {
    const time = ref.current?.getCurrentTime() || 0;
    ref.current?.getInternalPlayer()?.pause();
    const newTime = Math.max(time + frames / frameRate, 0);
    ref.current?.seekTo(newTime);
  }

  const getCurrentTime = () => {
    const time = ref.current?.getCurrentTime() || 0;
    return time;
  };

  const onStepFrames = (frames: number) => () => {
    updateFrames(frames);
  };

  const onSetStart = () => {
    setStart(getCurrentTime());
  };

  const onSetEnd = () => {
    setEnd(getCurrentTime());
  };

  return (
    <div className="flex">
      <ReactPlayer
        id="twitch-embed"
        ref={ref}
        url={props.uri}
        controls={true}
        config={{
          twitch: {
            options: {
              autoplay: false,
              allowfullscreen: false,
              muted: true,
            },
          },
        }}
        width={640}
        height={360}
      />
      {/* Frame control buttons */}
      <FrameStepButtons onStepFrames={onStepFrames} />

      {/* Push states */}
      <div className="flex-none items-center">
        <FrameRateInput key={"tw-" + video_id} helpText={HelpText} />
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
