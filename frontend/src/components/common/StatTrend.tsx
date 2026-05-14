import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";


type Props = {

  value: string;

  positive?: boolean;
};


function StatTrend({
  value,
  positive = true,
}: Props) {

  return (

    <div
      className={`
        flex
        items-center
        gap-1
        text-xs
        font-semibold

        ${
          positive
            ? "text-green-400"
            : "text-red-400"
        }
      `}
    >

      {positive ? (

        <ArrowUpRight
          size={14}
        />

      ) : (

        <ArrowDownRight
          size={14}
        />

      )}

      <span>
        {value}
      </span>

    </div>
  );
}

export default StatTrend;