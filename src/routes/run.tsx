import { Navigate, useParams } from "react-router-dom";
import { useRuns } from ".";
import { useEffect, useMemo, useState } from "react";
import VideoSelect from "../components/RunView/VideoSelector";
import { getRunVideoUris } from "../components/RunsList/RunData";
import YoutubePlayer from "../components/Video/YoutubePlayer";
import { useTiming } from "../components/Providers/TimingProvider";
import { useSegments } from "../components/Providers/SegmentProvider";
import SegmentTable from "../components/RunView/SegmentTable";
import TwitchPlayer from "../components/Video/TwitchPlayer";
import Button from "../components/General/Button";
import MarkdownRegion from "../components/General/MarkdownRegion";
import { copyTextClipboard, normalizeExternalUrl } from "../utils";
import { scriptText as BiliBiliScriptText } from "../components/Video/BiliBiliScript";
import { ClipboardIcon } from "@heroicons/react/24/outline";

function RunInfoBlock({
  title,
  markdown,
}: {
  title: string;
  markdown?: string;
}) {
  if (!markdown?.trim()) {
    return null;
  }

  return (
    <section className="mt-4 max-w-5xl rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="max-h-[40vh] overflow-y-auto">
        <MarkdownRegion markdown={markdown} />
      </div>
    </section>
  );
}

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

  const firstVideo = getRunVideoUris(run)[0] || "";
  const [video, setVideo] = useState<string>(firstVideo);
  const normalizedVideo = useMemo(() => normalizeExternalUrl(video), [video]);

  useEffect(() => {
    setVideo(firstVideo);
  }, [firstVideo]);

  const handleSelect = (video: string) => {
    setVideo(video);
  };

  let videoPlayer = useMemo(() => {
    if (
      video.includes("yt") ||
      video.includes("youtube") ||
      video.includes("youtu.be")
    ) {
      return <YoutubePlayer uri={normalizedVideo} run={run} run_id={run.id} />;
    }
    if (video.includes("twitch")) {
      return <TwitchPlayer uri={normalizedVideo} run={run} run_id={run.id} />;
    }
    return null;
  }, [video, normalizedVideo, frameRate]);

  const nullPlayer = useMemo(() => {
    return (
      <div className="p-4">
        Invalid video URL (may be bilibili or some other issue?).
        <br />
        <a
          className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
          href={normalizedVideo}
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
          <div>
            Alternatively if you have yt-dlp installed, you can run the
            following command in your terminal to download the video:
            <pre className="whitespace-pre-wrap">
              {`yt-dlp -o ${run.id}.mp4 ${normalizedVideo}`}
            </pre>
          </div>
          <RunInfoBlock title="Rules" markdown={run.rules} />
          <RunInfoBlock
            title="Run comments"
            markdown={run.comment || undefined}
          />
        </div>
      </div>
    );
  }, [normalizedVideo, run.comment, run.id, run.rules, video]);

  return (
    <div className="h-full">
      <div className="flex flex-row items-center">
        <div className="has-tooltip">
          <button
            type="button"
            className="relative mr-4 rounded-full p-2 text-gray-900  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset active:ring-2 active:ring-inset active:ring-indigo-600"
            onClick={() => copyTextClipboard(normalizedVideo)}
          >
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Reload data</span>
            <ClipboardIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="tooltip bg-white-100 pointer-events-none translate-x-10 rounded bg-white p-1 text-black shadow-lg">
            <pre>Copy video link to clipboard</pre>
          </div>
        </div>

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
