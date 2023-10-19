import React from "react";
import ReactDOM from "react-dom/client";

import App from "./app/App";
import { ContextProvider } from "./app/SocketContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
