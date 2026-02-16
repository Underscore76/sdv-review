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

export default function LocalPlayer(props: PlayerProps) {
  const { uri, run } = props;
  const run_id = run.id;
  const { frameRate, setStart, setEnd } = useTiming();
  const ref = React.useRef<ReactPlayer | null>(null);

  let video_id = "";
  if (uri.startsWith("blob:")) {
    video_id = uri;
  } else {
    return <div>Invalid Local File</div>;
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
        id="local-embed"
        ref={ref}
        url={props.uri}
        controls={true}
        config={{
          file: {
            attributes: {
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
        <FrameRateInput key={"local-" + video_id} helpText={HelpText} />
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
