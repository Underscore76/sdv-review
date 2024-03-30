import { Status } from "../../Constants";
import { Run } from "./RunData";
import { Link } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
function Badge({ text }: { text: string }) {
  return (
    <span
      className={classNames(
        "bg-green-50 text-green-700 ring-green-600/20",
        "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
      )}
    >
      {text}
    </span>
  );
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
    links: {
      uri: string;
    }[];
  };
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
  let subcategory =
    run.values["Roommate"] ||
    run.values["Subcategory"] ||
    run.values["Bundles"] ||
    run.values["Seeded Bundles"] ||
    run.values["Mines"] ||
    run.values["Seeded Mines"] ||
    run.values["Meme"] ||
    run.values["Junimo Kart"];
  return (
    <li key={run.id} className="flex items-center justify-between gap-x-6 py-5">
      <div className="min-w-0">
        <div className="flex items-start gap-x-3">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            <a href={run.weblink} target="_blank">
              {run.values.Glitches} - {run.category.data.name}
            </a>
          </p>
          <Badge text={run.values["Number of players"] + "p"} />
          <Badge text={subcategory} />
        </div>
        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
          <p className="whitespace-nowrap">
            Submitted on{" "}
            <time dateTime={run.submitted}>{run.submitted.split("T")[0]}</time>
          </p>
          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
            <circle cx={1} cy={1} r={1} />
          </svg>
          <p className="truncate">
            Submitted by {run.players?.data[0]?.names?.international || ""}
          </p>
        </div>
      </div>
      <div className="flex flex-none items-center gap-x-4">
        <div className="relative">
          <div className="flex">
            <Link
              to={`run/${run.id}`}
              className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
            >
              View Run<span className="sr-only">View Run</span>
            </Link>
            <a
              href={`${run.weblink}/edit`}
              target="_blank"
              className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
            >
              <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}
