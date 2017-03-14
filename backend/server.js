import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import passportRoute from './routes/passportLogin';
import userRoute from './routes/userRoute';
import gitLabRoute from './routes/gitLabRoute'

dotenv.config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, () => console.log('Connected via mongoose'));

const app = express();
app.use(bodyParser.json());

app.use(passportRoute);
app.use(userRoute);
app.use(gitLabRoute);

app.listen(8080, () => console.log('Server is running on localhost:8080'));
