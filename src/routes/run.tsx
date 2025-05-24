import { Navigate, useParams } from "react-router-dom";
import { useRuns } from ".";
import { useEffect, useMemo, useState } from "react";
import VideoSelect from "../components/RunView/VideoSelector";
import YoutubePlayer from "../components/Video/YoutubePlayer";
import { useTiming } from "../components/Providers/TimingProvider";
import { useSegments } from "../components/Providers/SegmentProvider";
import SegmentTable from "../components/RunView/SegmentTable";
import TwitchPlayer from "../components/Video/TwitchPlayer";
import Button from "../components/General/Button";
import { copyTextClipboard } from "../utils";
import { scriptText as BiliBiliScriptText } from "../components/Video/BiliBiliScript";
import { ShareIcon } from "@heroicons/react/20/solid";

export default function RunView() {
  const runs = useRuns();
  const params = useParams();
  const { frameRate, setStart, setEnd, setFrameRate } = useTiming();

  const { segments, setSegments } = useSegments();
  const run = runs.find((run) => run.id === params.id);
  if (!run) {
    return <Navigate to="/" replace={true} />;
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
    if (video.includes("twitch")) {
      return <TwitchPlayer uri={video} run_id={run.id} />;
    }
    return null;
  }, [video, frameRate]);

  const nullPlayer = useMemo(() => {
    return (
      <div className="p-4">
        Invalid video URL (may be bilibili or some other issue?).
        <br />
        <a
          className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
          href={video}
          target="_blank"
        >
          {video}
        </a>
        <hr />
        <div className="flex max-w-5xl flex-col">
          <div>
            If this video is a bilibili video, we have some javascript code you
            can run in your browser console to streamline retiming directly on
            the bilibili page.
          </div>
          <div>
            <Button
              variant="red"
              onClick={() => copyTextClipboard(BiliBiliScriptText)}
            >
              Copy BiliBili Retiming script to clipboard
            </Button>
          </div>
          <div>
            Click the video link to open BiliBili, open up the developer console
            (F12 in Chrome, ctrl+shift+j or command+shift+j in many browsers),
            and paste the script into the console then press enter to run it.
            After that, you can close the console. This should insert buttons
            above the right panel to do your retiming.
          </div>
        </div>
      </div>
    );
  }, [video]);

  return (
    <div>
      <div className="flex flex-row items-center">
        <button
          type="button"
          className="relative mr-4 rounded-full p-2 text-gray-900  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          onClick={() => copyTextClipboard(video)}
        >
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Reload data</span>
          <ShareIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex min-w-[500px] flex-col">
          <VideoSelect run={run} onSelect={handleSelect} />
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
