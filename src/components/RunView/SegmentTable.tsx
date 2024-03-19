import { XMarkIcon } from "@heroicons/react/24/outline";
import { formatTime } from "../../utils";
import { Segment } from "../Providers/SegmentProvider";
import Button from "../General/Button";

export default function SegmentTable({
  segments,
  setSegments,
}: {
  segments: Segment[];
  setSegments: (segments: Segment[]) => void;
}) {
  const removeSegment = (index: number) => {
    let newSegments = [...segments];
    newSegments.splice(index, 1);
    console.log("removing segment", index, segments, newSegments);
    setSegments(newSegments);
  };

  const clearSegments = () => {
    setSegments([]);
  };

  const totalDuration = () => {
    const totalSeconds = segments.reduce(
      (acc, segment) => acc + segment.duration,
      0,
    );
    return formatTime(totalSeconds);
  };

  return (
    <div className="h-[calc(100vh-390px-64px-48px)] overflow-scroll border-t-2 border-b-black bg-white py-4">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Total Time: {totalDuration()}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Set of all measured segments
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Button variant="red" onClick={clearSegments}>
              Clear All
            </Button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Start
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        End
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Duration
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                      >
                        <span className="sr-only">Clear</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {segments.map((segment, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {segment.start}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {segment.end}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatTime(segment.duration)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-0">
                          <button onClick={() => removeSegment(index)}>
                            <XMarkIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
