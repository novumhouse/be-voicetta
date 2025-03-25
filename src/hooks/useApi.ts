
import { useState, useEffect } from 'react';
import apiService, { 
  HealthStatus,
  Availability,
  Reservation,
  Property
} from '@/services/apiService';

// Check if we should use mock API (for development)
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

export function useHealthStatus() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const data = useMockApi 
          ? await apiService.getMockHealthStatus()
          : await apiService.getHealthStatus();
        setStatus(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Set up polling for status updates every 30 seconds
    const intervalId = setInterval(fetchStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  return { status, loading, error };
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        // In a real implementation, we would call the actual API
        // For now, we'll use the mock data
        const data = await apiService.getMockReservations();
        setReservations(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return { reservations, loading, error };
}

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  useEffect(() => {
    // Load API key from localStorage on component mount
    setApiKey(apiService.getApiKey());
  }, []);
  
  const updateApiKey = (key: string) => {
    apiService.setApiKey(key);
    setApiKey(key);
  };
  
  const clearApiKey = () => {
    apiService.clearApiKey();
    setApiKey(null);
  };
  
  return { apiKey, updateApiKey, clearApiKey };
}
