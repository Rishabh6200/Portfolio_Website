import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { connectDatabase } from './src/config/db.js';
import { router } from './src/routes/userRoutes.js';
import cors from 'cors'
import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT;

connectDatabase();

app.use(cors())
app.use(bodyParser.json());
app.use('/v1', router)

app.get('/', (req, res) => {
    const data = {
        s: "hello",
        a: "jfvhjkdfv",
        x: "lkdhvd"
    }
    res.send(data)
})

app.listen(port, () => {
    console.log(`The Website is live on http://localhost:${port}/`)
})