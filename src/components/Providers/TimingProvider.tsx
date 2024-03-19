import { createContext, useContext, useState } from "react";

type TimingContextType = {
  start: number;
  setStart: (start: number) => void;
  end: number;
  setEnd: (end: number) => void;
  frameRate: number;
  setFrameRate: (frameRate: number) => void;
};

const defaultTimingContext: TimingContextType = {
  start: 0,
  setStart: () => {},
  end: 0,
  setEnd: () => {},
  frameRate: 30,
  setFrameRate: () => {},
};

const TimingContext = createContext<TimingContextType>(defaultTimingContext);

export default function TimingProvider(props: { children: React.ReactNode }) {
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  const [frameRate, setFrameRate] = useState<number>(30);

  return (
    <TimingContext.Provider
      value={{ start, setStart, end, setEnd, frameRate, setFrameRate }}
    >
      {props.children}
    </TimingContext.Provider>
  );
}

export function useTiming() {
  return useContext<TimingContextType>(TimingContext);
}
