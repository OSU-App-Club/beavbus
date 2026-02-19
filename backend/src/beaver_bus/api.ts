import express from "express"

import APIClient from "./client";

const router = express.Router();

const BeavBusAPI = new APIClient();

router.get('/stops', async (req, res) => {
    res.send(await BeavBusAPI.getStops(req.query.route_id));
})

router.get('/routes', async (req, res) => {
    res.send(await BeavBusAPI.getRoutes())
})

export default router;