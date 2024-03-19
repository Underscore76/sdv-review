import { useState } from "react";
import { useTiming } from "../Providers/TimingProvider";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export default function FrameRateInput({ helpText }: { helpText: string }) {
  const [error, setError] = useState(false);
  const { setFrameRate } = useTiming();

  const isError = (e: React.ChangeEvent<HTMLInputElement>) => {
    // want to check if the input is a positive integer
    const value = Number(e.target.value);
    const intVal = parseInt(e.target.value);

    if (value <= 0 || isNaN(value) || intVal !== value) {
      setError(true);
      return true;
    } else {
      setError(false);
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center px-4 pt-2">
      <div className="flex items-center">
        <h2>Frame Rate</h2>
        &nbsp;
        <div className="has-tooltip">
          <QuestionMarkCircleIcon className=" h-5 w-5 text-gray-500"></QuestionMarkCircleIcon>
          <span className="tooltip bg-white-100 pointer-events-none -mt-8 rounded bg-white p-1 text-black shadow-lg">
            {helpText}
          </span>
        </div>
      </div>
      <div className="mt-2">
        <input
          type="number"
          min="0"
          pattern="[1-9]*[0-9]*"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="default is 30"
          onChange={(e) => {
            if (!isError(e)) {
              setFrameRate(parseInt(e.target.value));
            }
          }}
          aria-invalid="true"
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          FPS must be a positive integer
        </p>
      )}
    </div>
  );
}
