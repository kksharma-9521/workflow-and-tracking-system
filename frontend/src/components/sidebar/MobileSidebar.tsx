import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Video,
  X,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";


type Props = {

  open: boolean;

  onClose: () => void;
};


const items = [

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
];


function MobileSidebar({
  open,
  onClose,
}: Props) {

  return (

    <>

      {/* Overlay */}

      {open && (

        <div
          onClick={onClose}
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            backdrop-blur-sm
            lg:hidden
          "
        />

      )}


      {/* Drawer */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-[280px]
          border-r
          border-[#1F2937]
          bg-[#111827]
          px-5
          py-6
          transition-transform
          duration-300
          lg:hidden

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Top */}

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h1
              className="
                text-2xl
                font-bold
                text-white
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

          <button
            onClick={onClose}
            className="
              rounded-lg
              bg-[#0F172A]
              p-2
            "
          >

            <X
              size={20}
              className="
                text-white
              "
            />

          </button>

        </div>


        {/* Nav */}

        <nav
          className="
            mt-10
            flex
            flex-col
            gap-3
          "
        >

          {items.map(
            (item) => {

              const Icon =
                item.icon;

              return (

                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={onClose}
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

                    ${
                      isActive
                        ? `
                          border
                          border-blue-500/30
                          bg-blue-600/20
                          text-blue-400
                        `
                        : `
                          text-gray-300
                          hover:bg-[#1E293B]
                        `
                    }
                  `}
                >

                  <Icon
                    size={20}
                  />

                  {item.label}

                </NavLink>
              );
            }
          )}

        </nav>

      </aside>

    </>
  );
}

export default MobileSidebar;