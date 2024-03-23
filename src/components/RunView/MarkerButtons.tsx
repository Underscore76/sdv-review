import { interpTime } from "../../utils";
import Button from "../General/Button";
import { useSegments } from "../Providers/SegmentProvider";
import { useTiming } from "../Providers/TimingProvider";

type PushButtonsProps = {
  video_uri: string;
  run_id: string;
  onSetStart: () => void;
  onSetEnd: () => void;
};

export default function PushButtons(props: PushButtonsProps) {
  const { video_uri, run_id, onSetStart, onSetEnd } = props;
  const { start, end, frameRate } = useTiming();
  const { segments, setSegments } = useSegments();

  const saveSegment = () => {
    const startTime = Math.min(start, end);
    const endTime = Math.max(start, end);
    const interpStartTime = interpTime(startTime, frameRate);
    const interpEndTime = interpTime(endTime, frameRate);
    const duration = interpEndTime - interpStartTime;
    if (duration === 0) {
      return;
    }
    const currentSegment = {
      frameRate: frameRate,
      start: startTime,
      end: endTime,
      duration,
      video_uri: video_uri,
      run_id: run_id,
    };

    setSegments([...segments, currentSegment]);
    // setStart(0);
    // setEnd(0);
  };

  return (
    <div className="flex flex-col justify-center px-4 pt-2">
      <div className="flex justify-center space-x-1 px-4 pt-2">
        <Button key="set-start" variant="green" onClick={onSetStart}>
          Set Start
        </Button>
        <Button key="set-end" variant="red" onClick={onSetEnd}>
          Set End
        </Button>
      </div>
      <div className="flex flex-col divide-y-2 px-4 pt-2">
        <Button key="push-segment" variant="blue" onClick={saveSegment}>
          Push
        </Button>
      </div>
    </div>
  );
}
