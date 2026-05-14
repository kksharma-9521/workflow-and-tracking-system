import {
  AlertTriangle,
} from "lucide-react";


type Props = {

  title: string;

  description: string;
};


function ErrorState({
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
        border-red-500/20
        bg-red-500/5
        px-8
        py-16
        text-center
      "
    >

      <div
        className="
          rounded-full
          bg-red-500/10
          p-5
        "
      >

        <AlertTriangle
          size={40}
          className="
            text-red-400
          "
        />

      </div>

      <h2
        className="
          mt-6
          text-2xl
          font-bold
          text-red-400
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-3
          max-w-md
          text-sm
          text-gray-300
        "
      >
        {description}
      </p>

    </div>
  );
}

export default ErrorState;
