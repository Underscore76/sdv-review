import { Home, loader as rootLoader } from "./routes/index";
import LocalView from "./routes/local";
import ManualView from "./routes/manual";
import RunView from "./routes/run";

export const MainRoutes = [
  {
    path: "/",
    element: <Home />,
    loader: rootLoader,
    children: [
      {
        path: "run/manual",
        element: <ManualView />,
        errorElement: <div>Run Not Found</div>,
      },
      {
        path: "run/local",
        element: <LocalView />,
        errorElement: <div>Run Not Found</div>,
      },
      {
        path: "run/:id",
        element: <RunView />,
        errorElement: <div>Run Not Found</div>,
      },
    ],
  },
];
