import {
  Bell,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";


type Notification = {

  id: number;

  text: string;
};


const notifications: Notification[] = [

  {
    id: 1,
    text:
      "Video processing completed",
  },

  {
    id: 2,
    text:
      "Celery worker restarted",
  },

  {
    id: 3,
    text:
      "Redis queue synchronized",
  },
];


function NotificationBell() {

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const containerRef =
    useRef<HTMLDivElement>(
      null
    );


  useEffect(() => {

    function handleClickOutside(
      event: MouseEvent
    ) {

      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {

        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);


  return (

    <div
      ref={containerRef}
      className="
        relative
        z-50
      "
    >

      {/* Bell Button */}

      <button
        onClick={() =>
          setIsOpen(
            !isOpen
          )
        }

        className="
          relative
          rounded-xl
          border
          border-[#1F2937]
          bg-[#0F172A]
          p-3
          transition-all
          hover:bg-[#1E293B]
        "
      >

        <Bell size={20} />

        <div
          className="
            absolute
            right-2
            top-2
            h-2
            w-2
            rounded-full
            bg-red-500
          "
        />

      </button>


      {/* Dropdown */}

      {isOpen && (

        <div
          className="
            absolute
            right-0
            top-[72px]
            z-[999]
            w-[320px]
            overflow-hidden
            rounded-2xl
            border
            border-[#374151]
            bg-[#111827]
            shadow-[0_20px_60px_rgba(0,0,0,0.65)]
          "
        >

          {/* Header */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[#1F2937]
              px-5
              py-4
            "
          >

            <h2
              className="
                text-sm
                font-semibold
              "
            >
              Notifications
            </h2>

            <span
              className="
                text-xs
                text-gray-400
              "
            >
              3 new
            </span>

          </div>


          {/* Items */}

          <div
            className="
              flex
              flex-col
              gap-3
              p-4
            "
          >

            {notifications.map(
              (
                notification
              ) => (

                <div
                  key={
                    notification.id
                  }

                  className="
                    rounded-xl
                    border
                    border-[#1F2937]
                    bg-[#0F172A]
                    p-4
                    transition-all
                    hover:bg-[#111827]
                  "
                >

                  <p
                    className="
                      text-sm
                      text-white
                    "
                  >
                    {
                      notification.text
                    }
                  </p>

                </div>
              )
            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default NotificationBell;