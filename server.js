import bodyParser from 'body-parser';
import chat from './server/routes/chat';
import community from './server/routes/community';
import dotenv from 'dotenv';
import express from 'express';
import gitLabRoute from './server/helpers/gitlabRoute';
import mongoose from 'mongoose';
import passportRoute from './server/routes/passport';
import path from 'path';
import privateChat from './server/routes/private-chat';
import user from './server/routes/user';

// ALLOW SIGNUP W/O CERT(S):
export const isAllowedForDev = false;
// temporarily set to true to
// allow anyone in (for dev)

dotenv.config();

// initialize mongoDB
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGO_URL).then(
  (res) => { console.log('Mongoose connected') },
  (err) => { console.error('Error connecting to MongoDB. Make sure MongoDB is running.') }
);

// initialize Express app and setup routes
const app = express();
app.use(bodyParser.json());

app.use(passportRoute);
app.use(user);
app.use(community);
app.use(chat);
app.use(privateChat);
app.use(gitLabRoute);

// server main app and statis assets:
app.use(express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

// initialize Express server
const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Express Server is listening on port ${port}`));

// initialize Socket.io chat server
const io = require('socket.io')(server);
require('./server/chat/chat.js')(io);
