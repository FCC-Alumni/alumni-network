import express from 'express';
import passport from 'passport';
import axios from 'axios';
import PrivateChat from '../models/private-chat';
import { isAuthenticated } from './user';

const router = express.Router();

// populate client with all chats which include this user
router.get('/api/private-chat/initialize', isAuthenticated, (req, res) => {
  const { username } = req.user;
  PrivateChat.find({ members: username }, (err, history) => {
    if (err) throw err;
    res.json(history);
  });
});

// handle new messages
router.post('/api/private-chat/add-message', isAuthenticated, (req, res) => {
  const { username } = req.user;
  PrivateChat.findOne({ $and: [{members: username}, {members: req.body.reciepient}] }, (err, conversation) => {
    if (err) throw err;
    if (!conversation) {
      const chat = new PrivateChat({
        members: [ username, req.body.reciepient ],
        history: [ req.body ]
      });
      chat.save();
    } else {
      conversation.history.push(req.body);
      conversation.save();
    }
    res.end();
  });
});

// save a like event
router.post('/api/private-chat/like-message', isAuthenticated, (req, res) => {

});

// handle editing message
router.post('/api/private-chat/edit-message', isAuthenticated, (req, res) => {

});

// handle message deletion
router.post('/api/private-chat/edit-message', isAuthenticated, (req, res) => {

});

export default router;
