import express from 'express'
import { connectDatabase } from './src/config/db.js';
import { router } from './src/routes/userRoutes.js';
import cors from 'cors'
import bodyParser from 'body-parser';
const app = express();
const port = 5000;

connectDatabase();

app.use(cors())
app.use(bodyParser.json());
app.use('/api', router)

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.listen(port, () => {
    console.log(`The Website is live on http://localhost:${port}/`)
})