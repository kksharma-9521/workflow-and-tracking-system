import {
  createBrowserRouter,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import AnalyticsPage from "./pages/AnalyticsPage";
import DashboardPage from "./pages/DashboardPage";
import DocumentWorkflowPage from "./pages/DocumentWorkflowPage";
import VideoTrackingPage from "./pages/VideoTrackingPage";


export const router =
  createBrowserRouter([
    {
      path: "/",

      element: (
        <DashboardLayout />
      ),

      children: [

        {
          index: true,

          element: (
            <DashboardPage />
          ),
        },

        {
          path:
            "videos",

          element: (
            <VideoTrackingPage />
          ),
        },

        {
          path:
            "documents",

          element: (
            <DocumentWorkflowPage />
          ),
        },

        {
          path:
            "analytics",

          element: (
            <AnalyticsPage />
          ),
        },
      ],
    },
  ]);