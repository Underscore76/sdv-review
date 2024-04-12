import React from "react";
import ReactDOM from "react-dom/client";
import { MainRoutes } from "./MainRoutes.tsx";
import "./index.css";
import { RouterProvider, createHashRouter } from "react-router-dom";

const router = createHashRouter(MainRoutes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
