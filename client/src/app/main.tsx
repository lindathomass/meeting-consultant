import { RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import "./base.scss";
import "./i18n";
import { AppRouter } from "./AppRouter";

const container = document.getElementById("app")!;
const root = createRoot(container);
root.render(<RouterProvider router={AppRouter} />);
