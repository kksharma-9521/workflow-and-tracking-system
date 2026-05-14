type Props = {

  title: string;

  subtitle?: string;

  children: React.ReactNode;

  action?: React.ReactNode;
};


function SectionCard({
  title,
  subtitle,
  children,
  action,
}: Props) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-[#1F2937]
        bg-[#111827]
        p-6
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

        <div>

          <h2
            className="
              text-xl
              font-bold
            "
          >
            {title}
          </h2>

          {subtitle && (

            <p
              className="
                mt-2
                text-sm
                text-gray-400
              "
            >
              {subtitle}
            </p>

          )}

        </div>

        {action}

      </div>


      {/* Body */}

      <div className="mt-8">

        {children}

      </div>

    </div>
  );
}

export default SectionCard;