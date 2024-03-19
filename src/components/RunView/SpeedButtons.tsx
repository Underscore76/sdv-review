import Button from "../General/Button";

type SpeedButtonProps = {
  rates: number[];
  onSpeedUp: (rate: number) => () => void;
};

export default function SpeedButtons(props: SpeedButtonProps) {
  const { rates, onSpeedUp } = props;
  return (
    <div className="flex flex-col items-center divide-y-2 px-4 pt-2">
      <h2>Playback</h2>
      {rates?.map((rate) => (
        <Button key={rate} variant="gray" onClick={onSpeedUp(rate)}>
          {`${rate}x`}
        </Button>
      ))}
    </div>
  );
}
