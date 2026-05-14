import {
  useEffect,
  useState,
} from "react";


function useLastUpdated(
  intervalMs = 5000
) {

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState(
    new Date()
  );


  useEffect(() => {

    const interval =
      setInterval(
        () => {

          setLastUpdated(
            new Date()
          );
        },
        intervalMs
      );

    return () =>
      clearInterval(
        interval
      );

  }, [intervalMs]);


  return lastUpdated;
}

export default useLastUpdated;