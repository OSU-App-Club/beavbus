interface Stop {
    name: string,
    latitude: number,
    longitude: number,
    route_id: number,
    route_stop_id: number,
}

interface Route {
    name: string,
    latitude: number,
    longitude: number,
    route_id: number,
    link_to_stop_times: string,
    route_color: string
}

interface Vehicle {
    name: string,
    speed: number,
    heading: number,
    is_delayed: boolean,
    is_on_route: boolean,
    latitude: number,
    longitude: number,
    route_id: number,
    vehicle_id: number,
    seconds_at_stop: number,
    last_updated_timestamp: string
}

// "/Date(1772098571000-0700)/"
function ConvertAPITimestamp(timestamp: string): string {
    timestamp = timestamp.slice(6, timestamp.length - 2);
    let timestamp_parts = timestamp.split('-')

    const date = new Date();
    date.setUTCMilliseconds(Number(timestamp_parts[0]))
    return date.toLocaleString()
}

class BeaverBusAPI {
    base_url: string = "https://osushuttles.com";
    api_key: string;

    constructor() {
        this.__getClientSettings().then(() => {}).catch(() => {
            console.error("Failed to configure Beaver Bus API Client")
        });
    }

    async __getClientSettings() {
        // There is a bunch of configuration options here, we only really need the API Key.
        interface MapConfig {
            ApiKey: string
        }

        try {
            const res = await fetch(
                `${this.base_url}/Services/JSONPRelay.svc/GetMapConfig`
            );

            const map_config: MapConfig = await res.json();

            this.api_key = map_config.ApiKey;
            console.log("API Created");
        } catch (err) {
            console.error(err.message);
        }
    }

    async __getProtectedEndpoint(endpoint: string): Promise<any> {
        try {
            if (this.api_key.length <= 0) {
                throw "Beaver Bus API Key not present"
            }

            const res = await fetch(
                `${this.base_url}/Services/JSONPRelay.svc/${endpoint}?apiKey=${this.api_key}`
            );

            const data = await res.json();

            return data;
        } catch (err) {
            console.error(err.message);
        }
    }

    async __getProtectedEndpointWithParams(endpoint: string, params: string) {
        try {
            if (this.api_key.length <= 0) {
                throw "Beaver Bus API Key not present"
            }

            const res = await fetch(
                `${this.base_url}/Services/JSONPRelay.svc/${endpoint}?apiKey=${this.api_key}&${params}`
            );

            const data = await res.json();

            return data;
        } catch (err) {
            console.error(err.message);
        }
    }

    async getStops(routeID: number|null = null) {
        interface APIStop {
            Description: string,
            Latitude: number,
            Longitude: number,
            RouteID: number,
            RouteStopID: number
        };

        let returned_stops: APIStop[] = [];
        if (routeID) {
            returned_stops = await this.__getProtectedEndpointWithParams("GetStops", `routeID=${routeID}`);
        } else {
            returned_stops = await this.__getProtectedEndpoint("GetStops");
        }

        let stops = [];
        for (const api_stop of returned_stops) {
            let stop: Stop = {
                name: api_stop.Description,
                latitude: api_stop.Latitude,
                longitude: api_stop.Longitude,
                route_id: api_stop.RouteID,
                route_stop_id: api_stop.RouteStopID
            }
            stops.push(stop);
        }

        return stops;
    }

    async getRoutes() {
        interface APIRoute {
            Description: string,
            HideRouteLine: boolean,
            IsVisibleOnMap: boolean
            MapLineColor: string,
            MapLatitude: number,
            MapLongitude: number,
            RouteID: number,
            StopTimesPDFLink: string
        };

        let returned_routes: APIRoute[] = await this.__getProtectedEndpoint("GetRoutes");

        let routes = [];
        for (const api_route of returned_routes) {
            if (api_route.HideRouteLine || !api_route.IsVisibleOnMap) {
                continue;
            }

            let route: Route = {
                name: api_route.Description,
                latitude: api_route.MapLatitude,
                longitude: api_route.MapLongitude,
                route_id: api_route.RouteID,
                link_to_stop_times: api_route.StopTimesPDFLink,
                route_color: api_route.MapLineColor
            }
            routes.push(route);
        }

        return routes;
    }

    async getVehicleLocations(routeID: string, vehicleID: string) {
        interface APIVehicle {
            GroundSpeed: number,
            Heading: number,
            IsDelayed: boolean,
            IsOnRoute: boolean,
            Latitude: number,
            Longitude: number,
            Name: string,
            RouteID: number,
            Seconds: number,
            TimeStamp: string, // "/Date(1772098571000-0700)/"
            VehicleID: number,
        };

        let returned_vehicles: APIVehicle[] = [];

        let params = ``;
        if (routeID) {
            params += `routeID=${routeID}&`;
        }

        if (params) {
            returned_vehicles = await this.__getProtectedEndpointWithParams("GetMapVehiclePoints", params);
        } else {
            returned_vehicles = await this.__getProtectedEndpoint("GetMapVehiclePoints");
        }

        let vehicles = [];
        for (const api_vehicle of returned_vehicles) {
            let route: Vehicle = {
                name: api_vehicle.Name,
                latitude: api_vehicle.Latitude,
                longitude: api_vehicle.Longitude,
                route_id: api_vehicle.RouteID,
                speed: api_vehicle.GroundSpeed,
                heading: api_vehicle.Heading,
                is_delayed: api_vehicle.IsDelayed,
                is_on_route: api_vehicle.IsOnRoute,
                vehicle_id: api_vehicle.VehicleID,
                seconds_at_stop: api_vehicle.Seconds,
                last_updated_timestamp: ConvertAPITimestamp(api_vehicle.TimeStamp)
            }
            vehicles.push(route);
        }

        if (vehicleID) {
            vehicles = vehicles.filter((vehicle) => vehicle.vehicle_id == vehicleID);
        }
        

        return vehicles;
    }
}

export default BeaverBusAPI;