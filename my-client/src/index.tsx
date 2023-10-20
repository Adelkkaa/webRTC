import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import App from "./app/App";
import { ContextProvider } from "./app/SocketContext";
const ToastContainer = React.lazy(() =>
  import("react-toastify").then((comps) => ({
    default: comps.ToastContainer,
  }))
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ContextProvider>
    <App />
    <Suspense fallback={""}>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Suspense>
  </ContextProvider>
);
