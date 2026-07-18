import Button from "../General/Button";

type SpeedButtonProps = {
  rates: number[];
  onSpeedUp: (rate: number) => () => void;
};

export default function SpeedButtons(props: SpeedButtonProps) {
  const { rates, onSpeedUp } = props;
  const buttonClasses = "w-20 !px-2 !py-2";

  return (
    <div className="flex flex-col items-center gap-1 px-2 pt-2">
      <h2 className="text-base font-semibold leading-6 text-gray-900">
        Playback
      </h2>
      {rates?.map((rate) => (
        <Button
          key={rate}
          variant="gray"
          classNames={buttonClasses}
          onClick={onSpeedUp(rate)}
        >
          {`${rate}x`}
        </Button>
      ))}
    </div>
  );
}
