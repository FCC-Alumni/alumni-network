import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import passportRoute from './routes/passportLogin';
import userRoute from './routes/userRoute';
import gitLabRoute from './routes/gitLabRoute'

import socket_io from 'socket.io';
import socket from './chat-server/chat';

dotenv.config();

// initialize mongoDB
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGO_URL, () => console.log('Connected via mongoose'));

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
const io = socket_io(server);
socket(io);
