import {
  Inbox,
} from "lucide-react";


type Props = {

  title: string;

  description: string;
};


function EmptyState({
  title,
  description,
}: Props) {

  return (

    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-[#1F2937]
        bg-[#111827]
        px-8
        py-16
        text-center
      "
    >

      <div
        className="
          rounded-full
          bg-[#0F172A]
          p-5
        "
      >

        <Inbox
          size={40}
          className="
            text-blue-400
          "
        />

      </div>

      <h2
        className="
          mt-6
          text-2xl
          font-bold
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-3
          max-w-md
          text-sm
          text-gray-400
        "
      >
        {description}
      </p>

    </div>
  );
}

export default EmptyState;