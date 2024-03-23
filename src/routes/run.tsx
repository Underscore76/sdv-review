import { useParams } from "react-router-dom";
import { useRuns } from ".";
import { useEffect, useMemo, useState } from "react";
import VideoSelect from "../components/RunView/VideoSelector";
import YoutubePlayer from "../components/Video/YoutubePlayer";
import { useTiming } from "../components/Providers/TimingProvider";
import { useSegments } from "../components/Providers/SegmentProvider";
import SegmentTable from "../components/RunView/SegmentTable";

export default function RunView() {
  const runs = useRuns();
  const params = useParams();
  const { frameRate, setStart, setEnd, setFrameRate } = useTiming();

  const { segments, setSegments } = useSegments();
  const run = runs.find((run) => run.id === params.id);
  if (!run) {
    return <div>Run not found</div>;
  }

  useEffect(() => {
    setStart(0);
    setEnd(0);
    setFrameRate(30);
    setSegments([]);
  }, [run]);

  const [video, setVideo] = useState<string>(run.videos.links[0].uri);
  const handleSelect = (video: string) => {
    setVideo(video);
  };

  let videoPlayer = useMemo(() => {
    if (
      video.includes("yt") ||
      video.includes("youtube") ||
      video.includes("youtu.be")
    ) {
      return <YoutubePlayer uri={video} run_id={run.id} />;
    }
    return (
      <div>
        Invalid video URL.
        <br />
        {video}
      </div>
    );
  }, [video, frameRate]);

  return (
    <div>
      <VideoSelect run={run} onSelect={handleSelect} />
      {videoPlayer}
      <SegmentTable segments={segments} setSegments={setSegments} />
    </div>
  );
}
