import { useState, useEffect } from "react";
import * as Location from "expo-location";

interface UseLocationResult {
  location: Location.LocationObject | null;
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Location permission denied");
        setLoading(false);
        return;
      }

      let currentLocation: Location.LocationObject | null = null;
      try {
        currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      } catch {
        currentLocation = await Location.getLastKnownPositionAsync();
        if (!currentLocation) {
          setError("Unable to obtain current location");
        }
      }

      setLocation(currentLocation);
    } catch {
      setError("Unable to obtain current location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return {
    location,
    error,
    loading,
    refresh: getLocation,
  };
}

export default useLocation;
