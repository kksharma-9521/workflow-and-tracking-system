import {
  X,
} from "lucide-react";


type Props = {

  open: boolean;

  title: string;

  onClose: () => void;

  children: React.ReactNode;
};


function Modal({
  open,
  title,
  onClose,
  children,
}: Props) {

  if (!open)
    return null;


  return (

    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/70
        p-4
        backdrop-blur-sm
      "
    >

      {/* Overlay */}

      <div
        onClick={onClose}
        className="
          absolute
          inset-0
        "
      />


      {/* Modal */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-2xl
          rounded-2xl
          border
          border-[#1F2937]
          bg-[#111827]
          shadow-2xl
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
            px-6
            py-5
          "
        >

          <h2
            className="
              text-xl
              font-bold
            "
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              rounded-lg
              bg-[#0F172A]
              p-2
              transition-all
              hover:bg-[#1E293B]
            "
          >

            <X size={18} />

          </button>

        </div>


        {/* Body */}

        <div className="p-6">

          {children}

        </div>

      </div>

    </div>
  );
}

export default Modal;