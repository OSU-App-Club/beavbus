import express from "express"
import * as dotenv from 'dotenv'
dotenv.config()

import beaver_bus_api from "./beaver_bus/api"

const app = express()
const port = process.env.PORT || 3000;

app.use('/api/beaver_bus', beaver_bus_api);

app.get("/", (req, res) => {
    res.send('Hello, World!');
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});