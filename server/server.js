import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import redis from 'redis';
import mongoose from 'mongoose';

import passportRoute from './routes/passportLogin';
import userRoute from './routes/userRoute';
import gitLabRoute from './routes/gitLabRoute'

dotenv.config();

// initialize redis
export const client = redis.createClient();
client.on('error', (err) => console.log(`Redis Error: ${err}`));
client.on('ready', () => console.log('Redis connected'));

// initialize mongoDB
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGO_URL, () => console.log('Mongoose connected'));

// initialize Express app and setup routes
const app = express();
app.use(bodyParser.json());

app.use(passportRoute);
app.use(userRoute);
app.use(gitLabRoute);

// initialize Express server
const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Express Server is listening on port ${port}`));

// initialize Socket.io chat server
const io = require('socket.io')(server);
require('./chat-server/chat.js')(io);
