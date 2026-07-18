import { createContext, useCallback, useContext, useState } from "react";
import type { Segment } from "./SegmentProvider";

export type JumpToSegmentTime = (time: number, segment?: Segment) => void;

type VideoControlContextType = {
  jumpToSegmentTime: JumpToSegmentTime | null;
  setJumpToSegmentTime: (handler: JumpToSegmentTime | null) => void;
};

const defaultVideoControlContext: VideoControlContextType = {
  jumpToSegmentTime: null,
  setJumpToSegmentTime: () => {},
};

const VideoControlContext = createContext<VideoControlContextType>(
  defaultVideoControlContext,
);

export default function VideoControlProvider(props: {
  children: React.ReactNode;
}) {
  const [jumpToSegmentTime, setJumpToSegmentTimeState] =
    useState<JumpToSegmentTime | null>(null);

  const setJumpToSegmentTime = useCallback(
    (handler: JumpToSegmentTime | null) => {
      setJumpToSegmentTimeState(() => handler);
    },
    [],
  );

  return (
    <VideoControlContext.Provider
      value={{ jumpToSegmentTime, setJumpToSegmentTime }}
    >
      {props.children}
    </VideoControlContext.Provider>
  );
}

export function useVideoControls() {
  return useContext<VideoControlContextType>(VideoControlContext);
}
