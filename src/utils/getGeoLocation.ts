import { useState } from "react";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  locationLoading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    locationLoading: false,
  });

  const getLocation = () => {
    if (!("geolocation" in navigator)) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, locationLoading: true, error: null }));

    //high accuracy, timeout after 10s, cache for 5m
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    };

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          locationLoading: false,
        });
      },
      (error: GeolocationPositionError) => {
        let errorMessage = "An unknown error occurred.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Permission denied. Please allow location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        }
        setState({
          latitude: null,
          longitude: null,
          error: errorMessage,
          locationLoading: false,
        });
      },
      options,
    );
  };

  return { ...state, getLocation };
};
