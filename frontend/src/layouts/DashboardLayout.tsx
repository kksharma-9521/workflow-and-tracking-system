import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Radar,
  Video,
} from "lucide-react";

import TopSearchBar from "../components/navbar/TopSearchBar";

import SystemStatusCard from "../components/sidebar/SystemStatusCard";

import {
  Menu,
} from "lucide-react";

import {
  useState,
} from "react";

import MobileSidebar from "../components/sidebar/MobileSidebar";

import RealtimeClock from "../components/common/RealtimeClock";

import NotificationBell from "../components/common/NotificationBell";

import LiveStatusDot from "../components/common/LiveStatusDot";

import {
  NavLink,
  Outlet,
} from "react-router-dom";


const sidebarItems = [

  {
    label: "Dashboard",

    path: "/",

    icon:
      LayoutDashboard,
  },

  {
    label:
      "Video Tracking",

    path: "/videos",

    icon: Video,
  },

  {
    label:
      "Document Workflow",

    path: "/documents",

    icon: FileText,
  },

  {
    label:
      "Analytics",

    path: "/analytics",

    icon: BarChart3,
  },

  {
    label:
      "System Health",

    path: "/analytics",

    icon: Radar,
  },
];


function DashboardLayout() {

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  return (

    <div
    className="
        flex
        min-h-screen
        flex-col
        bg-[#0B1120]
        text-white
        lg:flex-row
    "
    >

      {/* Sidebar */}

    <aside
        className="
        hidden
        lg:flex
        lg:flex-col
        lg:w-[260px]
        lg:min-h-screen
        border-r
        border-[#1F2937]
        bg-[#111827]
        px-5
        py-6
        relative
        z-40
        shrink-0
        "
    >

        {/* Logo */}

        <div className="mb-10">

          <h1
            className="
              text-2xl
              font-bold
            "
          >
            AI OPS
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-400
            "
          >
            Workflow Platform
          </p>

        </div>


        {/* Navigation */}

        <nav
          className="
            flex
            flex-col
            gap-3
          "
        >

          {sidebarItems.map(
            (item) => {

              const Icon =
                item.icon;

              return (

                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({
                    isActive,
                  }) => `
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          bg-blue-600/20
                          text-blue-400
                          border
                          border-blue-500/30
                        `
                        : `
                          hover:bg-[#1E293B]
                          hover:text-blue-400
                        `
                    }
                  `}
                >

                  <Icon
                    size={20}
                  />

                  <span>
                    {item.label}
                  </span>

                </NavLink>
              );
            }
          )}

        </nav>


        <div className="mt-10">

        <SystemStatusCard />

        </div>

      </aside>


      {/* Main */}

      <main
        className="
            flex-1
            relative
            z-10
            overflow-x-hidden
        "
      >    

        {/* Navbar */}

        <header
          className="
            flex
            items-center
            justify-between
            border-b
            border-[#1F2937]
            bg-[#111827]/70
            px-8
            py-5
            backdrop-blur-md
            sticky
            top-0
            z-30
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              AI Workflow Dashboard
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-400
              "
            >
              Realtime AI
              orchestration
              platform
            </p>

          </div>

          <div
            className="
                flex
                items-center
                gap-4
            "
            >
              <RealtimeClock />
              <NotificationBell />

            <div
              className="
                rounded-xl
                border
                border-[#1F2937]
                bg-[#0F172A]
                px-4
                py-3
              "
            >

              <LiveStatusDot
                label="
                  System active
                "
              />

            </div>

            <TopSearchBar />

            </div>

        </header>


        {/* Routed Pages */}

        <div
            className="
                relative
                z-0
                p-8
            "
        >

          <Outlet />

        </div>

      </main>

    </div>
  );
}

export default DashboardLayout;