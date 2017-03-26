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
    if (err) throw res.sendStatus(500);
    res.json(history);
  });
});

// handle new messages
router.post('/api/private-chat/add-message', isAuthenticated, (req, res) => {
  const { username } = req.user;
  PrivateChat.findOne({ $and: [{members: username}, {members: req.body.reciepient}] }, (err, conversation) => {
    if (err) res.sendStatus(500);
    if (!conversation) {
      const chat = new PrivateChat({
        members: [ username, req.body.reciepient ],
        history: [ req.body ]
      });
      chat.save(e => {
        if (e) res.sendStatus(500);
        res.sendStatus(200);
      });
    } else {
      conversation.history.push(req.body);
      conversation.save(e => {
        if (e) res.sendStatus(500);
        res.sendStatus(200);
      });
    }
  });
});

// handle editing message
router.post('/api/private-chat/edit-message', isAuthenticated, (req, res) => {
  const { id, text, conversant } = req.body;
  const { username } = req.user;
    PrivateChat.findOne({ $and: [{members: username}, {members: conversant }] }, (err, chat) => {
      if (err) res.sendStatus(500);
      if (chat) {
        chat.history = chat.history.map(message => {
          if (message.id === id) message.text = text;
          return message;
        })
        chat.save(e => {
          if (e) res.sendStatus(500);
          res.sendStatus(200);
        });
      } else {
        res.sendStatus(404);
      }
    });
});

// save a like event
router.post('/api/private-chat/like-message', isAuthenticated, (req, res) => {
  const { id, conversant } = req.body;
  const { username } = req.user;
  PrivateChat.findOne({ $and: [{members: username}, {members: conversant }] }, (err, chat) => {
    if (err) res.sendStatus(500);
    if (chat) {
      chat.history = chat.history.map(message => {
        if (message.id === id) message.likes.push(username);
        return message;
      })
      chat.save(e => {
        if (e) res.sendStatus(500);
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

// handle message deletion
router.post('/api/private-chat/delete-message', isAuthenticated, (req, res) => {
  const { id, conversant } = req.body;
  const { username } = req.user;
  PrivateChat.findOne({ $and: [{members: username}, {members: conversant }] }, (err, conversation) => {
    if (err) res.sendStatus(500);
    if (conversation) {
      conversation.history = conversation.history.filter(m => m.id !== id);
      conversation.save(e => {
        if (e) res.sendStatus(500);
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

export default router;
