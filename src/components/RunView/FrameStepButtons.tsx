import Button from "../General/Button";

type FrameStepButtonProps = {
  onStepFrames: (frames: number) => () => void;
};

export default function FrameStepButtons(props: FrameStepButtonProps) {
  const { onStepFrames } = props;

  return (
    <div className="flex flex-col items-center divide-y-2 px-4 pt-2">
      <h2>Step</h2>
      <Button variant="red" onClick={onStepFrames(-60)}>
        {`< 60`}
      </Button>
      <Button variant="red" onClick={onStepFrames(-10)}>
        {`< 10`}
      </Button>
      <Button variant="red" onClick={onStepFrames(-5)}>
        {`< 5`}
      </Button>
      <Button variant="red" onClick={onStepFrames(-1)}>
        {`< 1`}
      </Button>
      <Button variant="green" onClick={onStepFrames(1)}>
        {`1 >`}
      </Button>
      <Button variant="green" onClick={onStepFrames(5)}>
        {`5 >`}
      </Button>
      <Button variant="green" onClick={onStepFrames(10)}>
        {`10 >`}
      </Button>
      <Button variant="green" onClick={onStepFrames(60)}>
        {`60 >`}
      </Button>
    </div>
  );
}
