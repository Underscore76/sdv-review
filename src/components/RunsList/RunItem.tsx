import { Status } from "../../Constants";
import { getRunVideoUris, Run } from "./RunData";
import { Link } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { formatTime } from "../../utils";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
type BadgeVariant = "green" | "orange" | "red" | "purple" | "sky" | "gray";

const badgeVariantClasses: Record<BadgeVariant, string> = {
  green: "bg-green-50 text-green-700 ring-green-600/20",
  orange: "bg-orange-50 text-orange-700 ring-orange-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  purple: "bg-purple-50 text-purple-700 ring-purple-600/20",
  sky: "bg-sky-50 text-sky-700 ring-sky-600/20",
  gray: "bg-gray-50 text-gray-700 ring-gray-600/20",
};

function Badge({
  text,
  variant = "green",
}: {
  text: string;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={classNames(
        badgeVariantClasses[variant],
        "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
      )}
    >
      {text}
    </span>
  );
}

function getVideoPlatform(uri: string) {
  const lowerUri = uri.toLowerCase();
  if (
    lowerUri.includes("youtube") ||
    lowerUri.includes("youtu.be") ||
    lowerUri.includes("youtube.com/playlist")
  ) {
    return "YouTube";
  }
  if (lowerUri.includes("twitch")) {
    return "Twitch";
  }
  if (lowerUri.includes("bilibili") || lowerUri.includes("b23.tv")) {
    return "BiliBili";
  }
  return "Other";
}

function getRunPlatform(run: Run) {
  return getVideoPlatform(getRunVideoUris(run)[0] || "");
}

function getPlatformBadgeVariant(platform: string): BadgeVariant {
  if (platform === "YouTube") {
    return "red";
  }
  if (platform === "Twitch") {
    return "purple";
  }
  if (platform === "BiliBili") {
    return "sky";
  }
  return "gray";
}

function formatDate(date: string | null | undefined) {
  return date ? date.split("T")[0] : "";
}

export type RunItemProps = {
  id: string;
  name: string;
  weblink: string;
  status: {
    status: Status;
  };
  date: string;
  submitted: string;
  videos: {
    text?: string;
    links: {
      uri: string;
    }[];
  } | null;
  players: {
    data: {
      id: string;
      names: {
        international: string;
      };
    }[];
  };
};

export default function RunItem({ run }: { run: Run }) {
  const subcategory =
    run.values["Roommate"] ||
    run.values["Subcategory"] ||
    run.values["Bundles"] ||
    run.values["Seeded Bundles"] ||
    run.values["Mines"] ||
    run.values["Seeded Mines"] ||
    run.values["Meme"] ||
    run.values["Perfection Type"] ||
    run.values["Junimo Kart"];
  const platform = getRunPlatform(run);
  const runDate = formatDate(run.date);
  const submittedDate = formatDate(run.submitted);
  const playerCount = run.values["Number of players"] + "p";

  return (
    <li
      key={run.id}
      className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="min-w-[160px] flex-1">
        <p className="min-w-0 text-sm font-semibold leading-6 text-gray-900">
          <a href={run.weblink} target="_blank">
            {run.values.Glitches} - {run.category.data.name}
          </a>
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <Badge
            text={playerCount}
            variant={playerCount === "1p" ? "green" : "orange"}
          />
          <Badge text={subcategory} />
          <Badge text={platform} variant={getPlatformBadgeVariant(platform)} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-xs leading-4 text-gray-500">
          <div className="min-w-0">
            <dt className="font-medium text-gray-700">Submitted</dt>
            <dd className="whitespace-nowrap">
              <time dateTime={run.submitted}>{submittedDate}</time>
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="font-medium text-gray-700">Run date</dt>
            <dd className="whitespace-nowrap">
              {runDate ? <time dateTime={run.date}>{runDate}</time> : "Unknown"}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="font-medium text-gray-700">Runner</dt>
            <dd className="truncate">
              {run.players?.data[0]?.names?.international || ""}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="font-medium text-gray-700">RTA</dt>
            <dd className="whitespace-nowrap">
              {formatTime(run.times.realtime_t)}
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex flex-none items-start">
        <div className="relative">
          <div className="flex overflow-hidden rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
            <Link
              to={`run/${run.id}`}
              className="hidden bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 sm:block"
            >
              View Run
            </Link>
            <a
              href={`${run.weblink}/edit`}
              target="_blank"
              className="hidden border-l border-gray-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 sm:block"
            >
              <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}
