import TimingProvider from "./Providers/TimingProvider";
import SegmentProvider from "./Providers/SegmentProvider";
import VideoControlProvider from "./Providers/VideoControlProvider";

export default function AppProviders(props: { children: React.ReactNode }) {
  return (
    <SegmentProvider>
      <TimingProvider>
        <VideoControlProvider>{props.children}</VideoControlProvider>
      </TimingProvider>
    </SegmentProvider>
  );
}
