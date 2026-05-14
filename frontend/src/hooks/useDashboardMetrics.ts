import {
  useEffect,
  useState,
} from "react";

import {
  getDashboardMetrics,
} from "../api/dashboardApi";


function useDashboardMetrics() {

  const [
    metrics,
    setMetrics,
  ] = useState<any>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);


  useEffect(() => {

    async function fetchMetrics() {

      try {

        const data =
          await getDashboardMetrics();

        setMetrics(data);

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

    fetchMetrics();

    const interval =
      setInterval(
        fetchMetrics,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);


  return {
    metrics,
    loading,
  };
}

export default useDashboardMetrics;