import { useEffect, useState } from 'react'
const BASE_URL = "https://osushuttles.com"

const decodePolyline = (encoded: string) => {
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;
    const points = [];

    while (index < len) {
        let b, shift = 0, result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        lat += ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = 0; result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        lng += ((result & 1) ? ~(result >> 1) : (result >> 1));

        points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
};

interface Stop {
    AddressID: number,
    Latitude: number,
    Longitude: number,
    Line1: string,
    Line2: string,
    Description: string,
    RouteID: number,
    RouteStopID: number,
    SecondsAtStop: number,
    SecodnsToNextStop: number,
    SignVerbiage: string
}

interface Route {
    Description: string,
    ETATypeID: number,
    MapLatitude: number,
    MapLongitude: number,
    MapLineColor: string,
    StopTimesPDFLink: string,
    Stops: Stop[]
    EncodedPolyline: string;
    linePoints?: { latitude: number; longitude: number }[];
}

interface Vehicle {
    VehicleID: number,
    RouteID: number,
    Seconds: number,
    Name: string,
    GroundSpeed: number,
    IsDelayed: boolean,
    IsOnRoute: boolean,
    Latitude: number,
    Longitude: number
}

interface BeavBusRoutesResult {
    routes: Route[] | null,
    error: string | null;
    loading: boolean;
    refresh: () => Promise<void>;
}

export function getBeavBusRoutes(): BeavBusRoutesResult {
    const [routes, setRoutes] = useState<Route[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const getBeavBusRoutes = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                `${BASE_URL}/Services/JSONPRelay.svc/GetRoutesForMapWithScheduleWithEncodedLine?apiKey=${process.env.EXPO_PUBLIC_BEAV_BUS_API_KEY}`
            );

            const data: Route[] = await res.json();

            const routesWithLines = data.map(route => ({
                ...route,
                linePoints: route.EncodedPolyline ? decodePolyline(route.EncodedPolyline) : []
            }));

            setRoutes(routesWithLines);

        }   catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get location");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBeavBusRoutes();
    }, []);

    return {
        routes,
        error,
        loading,
        refresh: getBeavBusRoutes,
    }
}

interface BeavBusVehiclePositionsResult {
    vehicles: Vehicle[] | null,
    error: string | null;
    loading: boolean;
    refresh: () => Promise<void>;
}

export function getBeavBusVehiclePositions(): BeavBusVehiclePositionsResult {
    const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const getBeavBusVehiclePositions = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                `${BASE_URL}/Services/JSONPRelay.svc/GetMapVehiclePoints?apiKey=${process.env.EXPO_PUBLIC_BEAV_BUS_API_KEY}`
            );

            const data: Vehicle[] = await res.json();

            setVehicles(data);
        }   catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get location");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBeavBusVehiclePositions();
    }, []);

    return {
        vehicles,
        error,
        loading,
        refresh: getBeavBusVehiclePositions,
    }
}