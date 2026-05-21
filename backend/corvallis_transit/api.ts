import express from "express"

import APIClient from "./client"
//import CacheMiddleware from "../cache"

const router = express.Router();

const CorvallisTransitAPI = new APIClient();

//router.get('/stops', CacheMiddleWare)