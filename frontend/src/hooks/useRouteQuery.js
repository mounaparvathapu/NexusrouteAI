import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Custom hook to fetch route data from the NexusRoute AI backend.
 */
export function useRouteQuery() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoute = useCallback(async (origin, destination) => {
    if (!origin.trim() || !destination.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await axios.post(`${API_BASE}/api/route`, {
        origin,
        destination,
      });
      setData(response.data);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch route data.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchRoute };
}
