import { interpTime } from "../../utils";
import Button from "../General/Button";
import MarkdownRegion from "../General/MarkdownRegion";
import { useSegments } from "../Providers/SegmentProvider";
import { useTiming } from "../Providers/TimingProvider";

type PushButtonsProps = {
  video_uri: string;
  run_id: string;
  rules?: string;
  comment?: string;
  onSetStart: () => void;
  onSetEnd: () => void;
  onJumpToTime?: (time: number) => void;
};

function MarkdownPopover({
  label,
  markdown,
}: {
  label: string;
  markdown?: string;
}) {
  if (!markdown?.trim()) {
    return null;
  }

  return (
    <div className="group relative inline-block">
      <div className="cursor-help text-base font-semibold text-gray-600 underline">
        {label}
      </div>
      <div className="absolute left-0 top-full z-10 hidden max-h-96 w-96 -translate-x-2/3 overflow-y-auto rounded bg-white p-2 text-xs text-gray-800 shadow-md group-hover:block">
        <MarkdownRegion markdown={markdown} />
      </div>
    </div>
  );
}

export default function PushButtons(props: PushButtonsProps) {
  const {
    video_uri,
    run_id,
    rules,
    comment,
    onSetStart,
    onSetEnd,
    onJumpToTime,
  } = props;
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
    <div className="flex w-60 flex-col justify-center gap-2 px-2 pt-2">
      <div className="grid grid-cols-2 gap-2">
        <Button
          key="set-start"
          variant="green"
          classNames="w-full !px-2 !py-2"
          onClick={onSetStart}
        >
          Set Start
        </Button>
        <Button
          key="set-end"
          variant="red"
          classNames="w-full !px-2 !py-2"
          onClick={onSetEnd}
        >
          Set End
        </Button>
      </div>
      {onJumpToTime && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            key="jump-start"
            variant="gray"
            classNames="w-full !px-2 !py-2"
            onClick={() => onJumpToTime(start)}
          >
            Jump Start
          </Button>
          <Button
            key="jump-end"
            variant="gray"
            classNames="w-full !px-2 !py-2"
            onClick={() => onJumpToTime(end)}
          >
            Jump End
          </Button>
        </div>
      )}
      <div>
        <Button
          key="push-segment"
          variant="blue"
          classNames="w-full !px-2 !py-2"
          onClick={saveSegment}
        >
          Push
        </Button>
      </div>
      {(rules?.trim() || comment?.trim()) && (
        <div className="flex flex-col items-center gap-1 pt-1">
          <MarkdownPopover label="Rules" markdown={rules} />
          <MarkdownPopover label="Comments" markdown={comment} />
        </div>
      )}
    </div>
  );
}
