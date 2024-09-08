import express from 'express';
import cors from 'cors'
import dotenv from "dotenv";
import connectDB from './Database/config.js';
import bodyParser from 'body-parser';

import router from './src/Routes/urlRoutes.js';
import userRoutes from './src/Routes/authRouter.js';


dotenv.config()
const app = express();
connectDB()
const port=process.env.PORT
app.use(cors())
app.use(bodyParser.json());
app.use('/api',router)
app.use('/api/user',userRoutes)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})




