import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import passportRoute from './routes/passportLogin';
import userRoute from './routes/userRoute';

dotenv.config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, () => console.log('Connected via mongoose'));

const app = express();
app.use(bodyParser.json());

app.use(passportRoute);
app.use(userRoute);

app.listen(8080, () => console.log('Server is running on localhost:8080'));
