import express from 'express';
import axios from 'axios';
import { isAuthenticated } from './user';
import Chat from '../models/chat';

const router = express.Router();

router.get('/api/chat-history', isAuthenticated, (req, res) => {
  Chat.findOne({}, (err, chat) => {
    if (!err && chat) {
      res.send(chat);
    } else {
      res.status(500);
    }
  })
});

router.post('/api/chat-add-message', isAuthenticated, (req, res) => {
  const message = req.body;
  Chat.findOne({}, (err, chat) => {
    if (err) res.sendStatus(500);
    if (!chat) {
      const newChat = new Chat({});
      newChat.history.push(message);
      newChat.save(e => {
        if (e) res.sendStatus(500);
        res.sendStatus(200);
      });
    } else {
      chat.history.push(message);
      chat.save(e => {
        if (e) res.sendStatus(500);
        res.sendStatus(200);
      });
    }
  });
});

router.post('/api/chat-edit-message', isAuthenticated, (req, res) => {
  const { id, text } = req.body;
  Chat.findOne({}, (err, chat) => {
    if (err) res.sendStatus(500);
    if (chat) {
      chat.history = chat.history.map(m => {
        if (m.id === id) {
          m.text = text;
          m.edited = true;
        }
        return m;
      });
      chat.save(e => {
        if (e) res.sendStatus(500);
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.post('/api/chat-like-message', isAuthenticated, (req, res ) => {
  const { id, liker } = req.body;
  Chat.findOne({}, (err, chat) => {
    if (err) res.sendStatus(500);
    if (chat) {
      chat.history = chat.history.map(m => {
        if (m.id === id) m.likes.push(liker);
        return m;
      });
      chat.save(e => {
        if (e) res.sendStatus(500);
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.post('/api/chat-delete-message', isAuthenticated, (req, res) => {
  Chat.findOne({}, (err, chat) => {
    if (err) res.sendStatus(500);
    if (chat) {
      chat.history = chat.history.filter(m => {
        return (m.id !== req.body);
      });
      chat.save(e => {
        if (e) res.sendStatus(500);
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

export default router;
