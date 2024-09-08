import express from 'express';
import cors from 'cors'
import dotenv from "dotenv";
import connectDB from './Database/config.js';
import routes from './Routes/routes.js';
import bodyParser from 'body-parser';
import userRoutes from './Routes/auth.router.js'


dotenv.config()
const app = express();
connectDB()
const port=process.env.PORT||5001;
app.use(cors())
app.use(bodyParser.json());
app.use('/api',routes)
app.use('/api/user',userRoutes)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})




