import { CONSTANTS } from "../Constants";
import {
  Outlet,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "react-router-dom";
import Navbar from "../components/Dashboard/Navbar";
import Header from "../components/Header";
import RunItem from "../components/RunsList/RunItem";
import { Run, Variable, VariableLookup } from "../components/RunsList/RunData";
import AppProviders from "../components/Providers";

export async function loader(): Promise<Run[]> {
  const game_id =
    sessionStorage.getItem(CONSTANTS.SESSION_STORAGE_KEY) || CONSTANTS.base;
  let varUrl = `${CONSTANTS.api_url}/games/${game_id}/variables`;
  let varResponse = await fetch(varUrl);
  let varData = await varResponse.json();

  let catMap: VariableLookup = {};
  varData.data.forEach((variable: Variable) => {
    let variableMap: { [key: string]: string } = {};
    Object.keys(variable.values.values).forEach((key) => {
      variableMap[key] = variable.values.values[key].label;
    });
    catMap[variable.id] = {
      choices: variableMap,
      name: variable.name,
    };
  });

  let url = `${CONSTANTS.api_url}/runs?game=${game_id}&status=new&max=1000&embed=players,category`;
  let response = await fetch(url);
  let data = await response.json();

  let runs = data.data satisfies Run[];
  runs.forEach((run: Run) => {
    let simple_values = {} as { [key: string]: string };
    Object.keys(run.values).forEach((key) => {
      let value = run.values[key];
      if (catMap[key]) {
        simple_values[catMap[key].name] = catMap[key].choices[value];
      } else {
        simple_values[key] = value;
      }
    });
    run.values = simple_values;
    run.weblink = run.weblink.replace("/run/", "/runs/");
  });
  return runs;
}

export function Home() {
  const data = useLoaderData() as Run[];
  const revalidator = useRevalidator();

  if (!data) {
    return <div>Loading...</div>;
  }

  const changeGame = (id: string) => {
    sessionStorage.setItem(CONSTANTS.SESSION_STORAGE_KEY, id);
    revalidator.revalidate();
  };

  return (
    <div className="max-h-screen">
      <Navbar
        onClickRefresh={() => revalidator.revalidate()}
        onSelectBoard={changeGame}
      />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-1/3">
          <div className="flex flex-col divide-y divide-gray-200 overflow-y-auto bg-white shadow">
            <Header text={`Runs - ${data.length}`} />
            <div className="h-[calc(100vh-150px)] overflow-y-auto">
              <div className="h-full flex-grow overflow-y-auto px-4 py-5 sm:p-6">
                {data.map((run: Run, index: number) => {
                  return <RunItem key={index} run={run} />;
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="w-2/3">
          <div className="divide-y divide-gray-200 bg-white shadow">
            <AppProviders>
              <Outlet context={data} />
            </AppProviders>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useRuns() {
  return useOutletContext<Run[]>();
}
