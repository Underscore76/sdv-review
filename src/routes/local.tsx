import { useEffect, useMemo, useState } from "react";
import { useTiming } from "../components/Providers/TimingProvider";
import { useSegments } from "../components/Providers/SegmentProvider";
import SegmentTable from "../components/RunView/SegmentTable";
import LocalPlayer from "../components/Video/LocalPlayer";

export default function LocalView() {
  const { frameRate, setStart, setEnd, setFrameRate } = useTiming();
  const { segments, setSegments } = useSegments();

  useEffect(() => {
    setStart(0);
    setEnd(0);
    setFrameRate(30);
    setSegments([]);
  }, []);
  const [video, setVideo] = useState<string>("");

  let videoPlayer = useMemo(() => {
    if (video) {
      return <LocalPlayer uri={video} run_id={"local"} />;
    }
    return null;
  }, [video, frameRate]);

  const nullPlayer = useMemo(() => {
    return <div className="p-4">Invalid video URL.</div>;
  }, [video]);
  return (
    <div>
      <div className="mt-2">
        <div className="block text-sm font-medium leading-6 text-gray-900">
          Video Url
        </div>
        <div className="relative mt-2">
          <input
            type="file"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => {
              if (e.target.files === null || e.target.files.length === 0) {
                setVideo("");
                return;
              }
              setVideo(URL.createObjectURL(e.target.files[0]));
            }}
            defaultValue={video}
            aria-invalid="true"
          />
        </div>
      </div>
      {(videoPlayer !== null && (
        <>
          {videoPlayer}
          <SegmentTable segments={segments} setSegments={setSegments} />
        </>
      )) ||
        nullPlayer}
    </div>
  );
}
