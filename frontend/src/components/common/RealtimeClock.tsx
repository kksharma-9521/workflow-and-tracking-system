import {
  useEffect,
  useState,
} from "react";


function RealtimeClock() {

  const [
    time,
    setTime,
  ] = useState(
    new Date()
  );


  useEffect(() => {

    const interval =
      setInterval(() => {

        setTime(
          new Date()
        );

      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, []);


  return (

    <div
      className="
        rounded-xl
        border
        border-[#1F2937]
        bg-[#0F172A]
        px-4
        py-2
      "
    >

      <p
        className="
          text-xs
          text-gray-400
        "
      >
        System Time
      </p>

      <h3
        className="
          mt-1
          text-sm
          font-semibold
        "
      >
        {time.toLocaleTimeString()}
      </h3>

    </div>
  );
}

export default RealtimeClock;