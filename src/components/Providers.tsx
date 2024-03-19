import TimingProvider from "./Providers/TimingProvider";
import SegmentProvider from "./Providers/SegmentProvider";

export default function AppProviders(props: { children: React.ReactNode }) {
  return (
    <SegmentProvider>
      <TimingProvider>{props.children}</TimingProvider>
    </SegmentProvider>
  );
}
