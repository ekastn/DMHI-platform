import "./index.css";

import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import App from "./App";
import { routes } from "./routes/routes";

const root = document.getElementById("root")!;

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error("Root element not found!");
}

render(() => <Router root={App}>{routes}</Router>, root);
