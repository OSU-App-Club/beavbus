import * as dotenv from 'dotenv'
dotenv.config()

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

class BeavBusAPI {
    api_key: string = process.env.BEAVBUS_API_KEY;
    base_url: string = "https://osushuttles.com";

    async getRoutes(this) {
        try {
            const res = await fetch(
                `${this.base_url}/Services/JSONPRelay.svc/GetRoutesForMapWithScheduleWithEncodedLine?apiKey=${this.api_key}`
            );

            const data: Route[] = await res.json();

            return data;
        } catch (err) {
            console.error(err.message);
        }
    }

    async getVehiclePoints(this) {
        try {
            const res = await fetch(
                `${this.base_url}/Services/JSONPRelay.svc/GetMapVehiclePoints?apiKey=${this.api_key}`
            );

            const data: Vehicle[] = await res.json();

            return data;
        } catch (err) {
            console.error(err.message);
        }
    }

    // Other APIs we could implement: GetStopArrivalTimes, GetRouteStopArrivals, GetRouteScheduleTimes, GetStops, GetRoutes (similar to above but without the encoded line or stop list)
}

const api = new BeavBusAPI();
api.getVehiclePoints().then((routes) => {
    console.log(routes)
})