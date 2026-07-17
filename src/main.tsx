import {ComponentPreviews, useInitial} from "./dev";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <DevSupport ComponentPreviews={ComponentPreviews} useInitialHook={useInitial}>
      <App />
    </DevSupport>
  </StrictMode>
);
