import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { connectDatabase } from './src/config/db.js';
import { router } from './src/routes/userRoutes.js';
import cors from 'cors'
import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 5000;

connectDatabase();
app.use(express.static('public'));
app.use(cors())
app.use(bodyParser.json());
app.use('/v1', router)

app.get('/', (req, res) => {
    res.send("App is running...")
})

app.listen(port, () => {
    console.log(`The Website is live on ${process.env.APP_SERVER_URL}`)
})