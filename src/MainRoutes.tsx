import { Home, loader as rootLoader } from "./routes/index";
import RunView from "./routes/run";

export const MainRoutes = [
  {
    path: "/",
    element: <Home />,
    loader: rootLoader,
    children: [
      {
        path: "run/:id",
        element: <RunView />,
        errorElement: <div>Run Not Found</div>,
      },
    ],
  },
];
