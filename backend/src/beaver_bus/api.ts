import express from "express"

import APIClient from "./client";
import CacheMiddleware from "../cache"

const router = express.Router();

const BeavBusAPI = new APIClient();

router.get('/stops', CacheMiddleware({
    timeout: 60 * 60 * 1000 * 24
}), async (req, res) => {
    res.send(await BeavBusAPI.getStops(req.query.route_id));
})

router.get('/routes', CacheMiddleware({
    timeout: 60 * 60 * 1000 * 24
}), async (req, res) => {
    res.send(await BeavBusAPI.getRoutes())
})

router.get('/vehicles', CacheMiddleware({
    timeout: 60 * 60 * 15
}), async (req, res) => {
    res.send(await BeavBusAPI.getVehicleLocations(req.query.route_id, req.query.vehicle_id))
})

export default router;