type Props = {

  label: string;

  color?: string;
};


function LiveStatusDot({
  label,
  color,
}: Props) {

  return (

    <div
      className="
        flex
        items-center
        gap-2
      "
    >

      <div className="relative">

        <div
          className={`
            h-3
            w-3
            rounded-full

            ${
              color ??
              "bg-green-500"
            }
          `}
        />

        <div
          className={`
            absolute
            inset-0
            animate-ping
            rounded-full

            ${
              color ??
              "bg-green-500"
            }
          `}
        />

      </div>

      <span
        className="
          text-sm
          text-gray-300
        "
      >
        {label}
      </span>

    </div>
  );
}

export default LiveStatusDot;