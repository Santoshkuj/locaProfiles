import { connectDB } from './config/dbConfig.js';

import UserRouter from './routers/userRoute.js';
import AdminRouter from './routers/adminRouter.js';
import AuthRouter from './routers/authRouter.js';

import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import createAdmin from './config/createAdmin.js';


dotenv.config(); 

const PORT = process.env.PORT || 5000;

const app = express();

connectDB();
createAdmin()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use('/api/user',UserRouter)
app.use('/api/admin',AdminRouter)
app.use('/api/auth',AuthRouter)

app.use( '*',(req,res)=>{
  res.status(404).json({message:'Page not found'})
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
