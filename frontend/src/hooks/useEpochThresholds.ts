import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';

interface EpochThreshold {
  epoch: string;
  threshold: number;
}

export function useEpochThresholds() {
  const [data, setData] = useState<EpochThreshold[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getEpochThresholds();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Erreur interne');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error };
}
