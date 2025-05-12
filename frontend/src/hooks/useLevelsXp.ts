import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';

interface LevelXp {
  level: number;
  xpRequired: number;
}

export function useLevelsXp() {
  const [data, setData] = useState<LevelXp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getLevelsXp();
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
