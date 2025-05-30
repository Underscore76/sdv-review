import BlueChicken from "../../assets/bluechicken.png";
import { Disclosure } from "@headlessui/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import BoardSelector from "./BoardSelector";
import { CONSTANTS } from "../../Constants";
import { Link } from "react-router-dom";

const Boards = [
  { name: "Base", id: CONSTANTS.base },
  { name: "CatEx", id: CONSTANTS.catex },
];

type NavbarProps = {
  onClickRefresh: () => void;
  onSelectBoard: (board: string) => void;
};

export default function Navbar(props: NavbarProps) {
  return (
    <Disclosure as="nav" className="bg-gray-800">
      <>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img className="h-8 w-8" src={BlueChicken} />
              </div>
              <h2 className="text-lg font-bold text-white">&nbsp;SDV Review</h2>
            </div>
            <div className="md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <Link
                  to={`run/local`}
                  className="relative rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Local File<span className="sr-only">Local File</span>
                </Link>
                <Link
                  to={`run/manual`}
                  className="relative rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Manual Link<span className="sr-only">Manual Link</span>
                </Link>
                <BoardSelector
                  onSelect={props.onSelectBoard}
                  options={Boards}
                />
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={props.onClickRefresh}
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Reload data</span>
                  <ArrowPathIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </Disclosure>
  );
}
