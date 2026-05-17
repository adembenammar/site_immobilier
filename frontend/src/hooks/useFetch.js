import { useEffect, useState } from "react";
import api from "../api/client";

export const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(url);
        if (active) {
          setData(response.data);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Unable to load data");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [url]);

  return { data, loading, error, setData };
};
