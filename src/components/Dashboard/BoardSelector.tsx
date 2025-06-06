import { Fragment, useEffect, useState } from "react";
import { Transition, Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CONSTANTS } from "../../Constants";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
type BoardOption = {
  name: string;
  id: string;
};

type BoardSelectorProps = {
  options: BoardOption[];
  onSelect?: (option: string) => void;
};

export default function BoardSelector(props: BoardSelectorProps) {
  const { options } = props;
  const [selected, setSelected] = useState<BoardOption | null>(null);

  useEffect(() => {
    const game_id =
      sessionStorage.getItem(CONSTANTS.SESSION_STORAGE_KEY) || CONSTANTS.base;
    const option = options.find((option) => option.id === game_id);
    if (option) {
      setSelected(option);
    } else {
      setSelected(options[0]);
    }
  }, [options]);

  const handleSelect = (option: BoardOption) => {
    setSelected(option);
    props.onSelect && props.onSelect(option.id);
  };

  return (
    <Listbox value={selected} onChange={handleSelect}>
      {({ open }) => (
        <>
          <div className="relative min-w-36 py-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">{selected?.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate",
                          )}
                        >
                          {option.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4",
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
