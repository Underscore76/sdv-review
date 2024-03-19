import { createContext, useContext, useState } from "react";

export type Segment = {
  start: number;
  end: number;
  run_id: string;
  video_uri: string;
  duration: number;
  frameRate: number;
};

type SegmentContextType = {
  segments: Segment[];
  setSegments: (segments: Segment[]) => void;
};

const defaultSegmentContext: SegmentContextType = {
  segments: [],
  setSegments: () => {},
};

const SegmentContext = createContext<SegmentContextType>(defaultSegmentContext);

export default function SegmentProvider(props: { children: React.ReactNode }) {
  const [segments, setSegments] = useState<Segment[]>([]);

  return (
    <SegmentContext.Provider value={{ segments, setSegments }}>
      {props.children}
    </SegmentContext.Provider>
  );
}

export function useSegments() {
  return useContext<SegmentContextType>(SegmentContext);
}
