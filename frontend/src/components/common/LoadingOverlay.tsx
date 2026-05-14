import {
  Loader2,
} from "lucide-react";


function LoadingOverlay() {

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        backdrop-blur-sm
      "
    >

      <div
        className="
          flex
          flex-col
          items-center
          rounded-2xl
          border
          border-[#1F2937]
          bg-[#111827]
          px-10
          py-8
        "
      >

        <Loader2
          size={44}
          className="
            animate-spin
            text-blue-400
          "
        />

        <p
          className="
            mt-5
            text-sm
            text-gray-400
          "
        >
          Processing AI workload...
        </p>

      </div>

    </div>
  );
}

export default LoadingOverlay;