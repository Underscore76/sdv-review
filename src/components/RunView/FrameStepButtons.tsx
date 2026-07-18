import Button from "../General/Button";

type FrameStepButtonProps = {
  onStepFrames: (frames: number) => () => void;
};

export default function FrameStepButtons(props: FrameStepButtonProps) {
  const { onStepFrames } = props;
  const buttonClasses = "w-20 !px-2 !py-2";

  return (
    <div className="flex flex-col items-center gap-1 px-2 pt-2">
      <h2 className="text-base font-semibold leading-6 text-gray-900">Step</h2>
      <Button
        variant="red"
        classNames={buttonClasses}
        onClick={onStepFrames(-60)}
      >
        {`< 60`}
      </Button>
      <Button
        variant="red"
        classNames={buttonClasses}
        onClick={onStepFrames(-10)}
      >
        {`< 10`}
      </Button>
      <Button
        variant="red"
        classNames={buttonClasses}
        onClick={onStepFrames(-5)}
      >
        {`< 5`}
      </Button>
      <Button
        variant="red"
        classNames={buttonClasses}
        onClick={onStepFrames(-1)}
      >
        {`< 1`}
      </Button>
      <Button
        variant="green"
        classNames={buttonClasses}
        onClick={onStepFrames(1)}
      >
        {`1 >`}
      </Button>
      <Button
        variant="green"
        classNames={buttonClasses}
        onClick={onStepFrames(5)}
      >
        {`5 >`}
      </Button>
      <Button
        variant="green"
        classNames={buttonClasses}
        onClick={onStepFrames(10)}
      >
        {`10 >`}
      </Button>
      <Button
        variant="green"
        classNames={buttonClasses}
        onClick={onStepFrames(60)}
      >
        {`60 >`}
      </Button>
    </div>
  );
}
