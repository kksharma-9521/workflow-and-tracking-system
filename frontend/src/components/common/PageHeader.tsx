type Props = {

  title: string;

  subtitle: string;

  action?: React.ReactNode;
};


function PageHeader({
  title,
  subtitle,
  action,
}: Props) {

  return (

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
            text-3xl
            font-bold
          "
        >
          {title}
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-gray-400
          "
        >
          {subtitle}
        </p>

      </div>

      {action}

    </div>
  );
}

export default PageHeader;