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

export default router;