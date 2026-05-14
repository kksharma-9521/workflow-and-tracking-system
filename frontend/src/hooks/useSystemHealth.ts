import {
  useEffect,
  useState,
} from "react";

import {
  getSystemHealth,
} from "../api/systemApi";


function useSystemHealth() {

  const [
    health,
    setHealth,
  ] = useState<any>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);


  useEffect(() => {

    async function fetchHealth() {

      try {

        const data =
          await getSystemHealth();

        setHealth(data);

      } catch (
        error
      ) {

        console.error(
          error
        );

      } finally {

        setLoading(false);
      }
    }

    fetchHealth();

    const interval =
      setInterval(
        fetchHealth,
        10000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);


  return {
    health,
    loading,
  };
}

export default useSystemHealth;