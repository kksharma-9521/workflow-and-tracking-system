import React from "react";

import ReactDOM from "react-dom/client";

import {
  RouterProvider,
} from "react-router-dom";

import {
  router,
} from "./router";

import {
  Toaster,
} from "react-hot-toast";

import "./styles/globals.css";


ReactDOM.createRoot(
  document.getElementById(
    "root"
  )!
).render(

  <React.StrictMode>

    <>

  <RouterProvider
    router={router}
  />

    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background:
            "#111827",

          color:
            "#ffffff",

          border:
            "1px solid #1F2937",
        },
      }}
    />
  </>

  </React.StrictMode>
);