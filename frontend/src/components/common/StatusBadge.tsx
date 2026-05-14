type Props = {

  status: string;
};


function StatusBadge({
  status,
}: Props) {

  function getStyles() {

    switch (
      status.toLowerCase()
    ) {

      case "completed":

        return `
          bg-green-500/10
          text-green-400
          border-green-500/20
        `;

      case "processing":

        return `
          bg-blue-500/10
          text-blue-400
          border-blue-500/20
        `;

      case "failed":

        return `
          bg-red-500/10
          text-red-400
          border-red-500/20
        `;

      default:

        return `
          bg-yellow-500/10
          text-yellow-400
          border-yellow-500/20
        `;
    }
  }


  return (

    <span
      className={`
        rounded-lg
        border
        px-3
        py-1
        text-xs
        font-semibold
        ${getStyles()}
      `}
    >
      {status}
    </span>
  );
}

export default StatusBadge;