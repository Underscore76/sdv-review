import { Home, loader as rootLoader } from "./routes/index";
import RunView from "./routes/run";

export const MainRoutes = [
  {
    path: "/sdv-review/",
    element: <Home />,
    loader: rootLoader,
    children: [
      {
        path: "run/:id",
        element: <RunView />,
        error: <div>Run Not Found</div>,
      },
    ],
  },
];
