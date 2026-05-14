import type {
  ReactNode,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


type Props = {

  title: string;

  description: string;

  icon: ReactNode;

  route?: string;
};


function QuickActionCard({
  title,
  description,
  icon,
  route,
}: Props) {

  const navigate =
    useNavigate();


  return (

    <button

      onClick={() => {

        if (route) {

          navigate(route);
        }
      }}

      className="
        group
        rounded-2xl
        border
        border-[#1F2937]
        bg-[#111827]
        p-6
        text-left
        transition-all
        duration-300
        hover:border-blue-500/30
        hover:bg-[#0F172A]
      "
    >

      <div
        className="
          mb-5
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-[#0F172A]
          transition-all
          duration-300
          group-hover:scale-105
        "
      >

        {icon}

      </div>


      <h3
        className="
          text-lg
          font-semibold
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          text-sm
          text-gray-400
        "
      >
        {description}
      </p>

    </button>
  );
}

export default QuickActionCard;