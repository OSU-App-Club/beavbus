import { useEffect, useState } from "react";

const BASE_URL = "https://osushuttles.com";
const CTS_BASE_URL = "https://arrive-monstrous-hazy-corvallisbus.itsjamie.dev";

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
    AddressID: number;
    Latitude: number;
    Longitude: number;
    Line1: string;
    Line2: string;
    Description: string;
    RouteID: number;
    RouteStopID: number;
    SecondsAtStop: number;
    SecodnsToNextStop: number;
    SignVerbiage: string;
    color?: string
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
    VehicleID: number;
    RouteID: number;
    Seconds: number;
    Name: string;
    GroundSpeed: number;
    IsDelayed: boolean;
    IsOnRoute: boolean;
    Latitude: number;
    Longitude: number;
}

interface RoutesResult {
    routes: Route[] | null,
    stops: Stop[] | null,
    error: string | null;
    loading: boolean;
    refresh: () => Promise<void>;
}

export function getCTSBusRoutes(): RoutesResult {
    const [routes, setRoutes] = useState<Route[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const getCTSBusRoutes = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                "https://corvallisbuswest.azurewebsites.net/api/static/",
            );

            const data = await response.json();

            const parsedRoutes: Route[] = [];
            const routesObj = data.routes;

            for (const key in routesObj) {
                if (routesObj.hasOwnProperty(key)) {
                    const rawRoute = routesObj[key];

                    const route: Route = {
                        Description: `Route ${rawRoute.routeNo}`,
                        ETATypeID: parseInt(rawRoute.routeNo, 10) || 0,
                        MapLatitude: 0,
                        MapLongitude: 0,
                        MapLineColor: `#${rawRoute.color}`,
                        StopTimesPDFLink: rawRoute.url,
                        Stops: [],
                        EncodedPolyline: rawRoute.polyline,
                        linePoints: rawRoute.polyline
                            ? decodePolyline(rawRoute.polyline)
                            : [],
                    };

                    parsedRoutes.push(route);
                }
            }

            setRoutes(parsedRoutes);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to get location",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCTSBusRoutes();
    }, []);

    return {
        routes,
        error,
        loading,
        refresh: getCTSBusRoutes,
    };
}

export function getBeavBusRoutes(): RoutesResult {
    const [routes, setRoutes] = useState<Route[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const getCTSBusRoutes = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                "https://corvallisbuswest.azurewebsites.net/api/static/",
            );

            const data = await response.json();

            const parsedRoutes: Route[] = [];
            const routesObj = data.routes;

            for (const key in routesObj) {
                if (routesObj.hasOwnProperty(key)) {
                    const rawRoute = routesObj[key];

                    const route: Route = {
                        Description: `Route ${rawRoute.routeNo}`,
                        ETATypeID: parseInt(rawRoute.routeNo, 10) || 0,
                        MapLatitude: 0,
                        MapLongitude: 0,
                        MapLineColor: `#${rawRoute.color}`,
                        StopTimesPDFLink: rawRoute.url,
                        Stops: [],
                        EncodedPolyline: rawRoute.polyline,
                        linePoints: rawRoute.polyline
                            ? decodePolyline(rawRoute.polyline)
                            : [],
                    };

                    parsedRoutes.push(route);
                }
            }

            setRoutes(parsedRoutes);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to get location",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCTSBusRoutes();
    }, []);

    return {
        routes,
        error,
        loading,
        stops: [],
        refresh: getCTSBusRoutes,
    };
}

export function getBeavBusRoutesAndStops(): RoutesResult {
    const [routes, setRoutes] = useState<Route[] | null>(null);
    const [stops, setStops] = useState<Stop[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const getBeavBusRoutesAndStops = async () => {
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

            const stopsWithColors: Stop[] = data.flatMap(route => (
                route.Stops.map(stop => ({
                    ...stop,
                    color: route.MapLineColor
                }))
            ))
            setStops(stopsWithColors)

        }   catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get location");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBeavBusRoutesAndStops();
    }, []);

    return {
        routes,
        stops,
        error,
        loading,
        refresh: getBeavBusRoutesAndStops,
    }
}

interface BeavBusVehiclePositionsResult {
    vehicles: Vehicle[] | null;
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
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to get location",
            );
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
    };
}

interface CTSVehiclePositionsResult {
    vehicles: Vehicle[] | null;
    error: string | null;
    loading: boolean;
    refresh: () => Promise<void>;
}

export function getCTSVehiclePositions(): CTSVehiclePositionsResult {
    const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const getCTSVehiclePositions = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                `${CTS_BASE_URL}/api/positions`,
            );

            const d = await res.json();
            const data: Vehicle[] = [];
            for (const bus of d) {
                let v: Vehicle = {
                    VehicleID: +bus.busLabel,
                    RouteID: bus.busLabel,
                    Seconds: 0,
                    Name: "",
                    GroundSpeed: bus.speed,
                    IsDelayed: false,
                    IsOnRoute: false,
                    Latitude: bus.latitude,
                    Longitude: bus.longitude
                }
                data.push(v);
            }

            setVehicles(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to get location",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCTSVehiclePositions();
    }, []);

    return {
        vehicles,
        error,
        loading,
        refresh: getCTSVehiclePositions,
    };
}

export function getBusRoutesAndStops(): RoutesResult {
    const ctsRoutes = getCTSBusRoutes();
    const beavBusRoutesAndStops = getBeavBusRoutesAndStops();

    let routes: Route[] = [];
    let stops: Stop[] = []
    if (ctsRoutes.routes)
        routes = routes.concat(ctsRoutes.routes)
    if (beavBusRoutesAndStops.routes)
        routes = routes.concat(beavBusRoutesAndStops.routes)
    if (beavBusRoutesAndStops.stops) 
        stops = stops.concat(beavBusRoutesAndStops.stops)
    // TODO: add CTS stops

    // Overlapping stops edge case handling
    let seenPoints = new Set<string>()
    stops.forEach((stop) => {
        const lat = stop.Latitude;
        const long = stop.Longitude;

        let key = `${lat.toFixed(10)}_${long.toFixed(10)}`
          if (seenPoints.has(key)) {
            stop.Longitude += 0.00015
            console.log(stop)
        }

        seenPoints.add(key)
    })

    return {
        routes: routes,
        error: "",
        loading: false,
        stops: stops,
        refresh: async () => {
            ctsRoutes.refresh();
            beavBusRoutesAndStops.refresh();
            return;
        }
    }
};