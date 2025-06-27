import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

import userRouter from './routes/userRoute.js';


const app = express();
const port = process.env.PORT || 4000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//DB CONNECTED
connectDB();

//ROUTES
app.use('/api/user' , userRouter);


app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 


