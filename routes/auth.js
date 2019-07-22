'use strict';

const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn, isFormFilled } = require('../middlewares/authMiddlewares');
// encriptacion database
// Crea el cat (la parte de adelante del password) la plain password
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* Las 5 acciones del usuario a la hora de authentification */

// enviara el formulario al usuario
router.get('/signup', isLoggedIn, (req, res, next) => {
  res.render('signup');
});

router.post('/signup', isLoggedIn, isFormFilled, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    // crea la password encryptada hashed
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await User.findOne({ username });
    if (user) {
      return res.redirect('/auth/signup');
    }
    const newUser = await user.create({
      username,
      password: hashedPassword

    });
    req.session.currentUser = newUser;
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/login', isLoggedIn, (req, res, next) => {
  res.render('login');
});

router.post('/login', isLoggedIn, isFormFilled, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.redirect('/auth/login');
    }
    if (bcrypt.compareSync(password /* provided password */, user.password/* hashed password */)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

// recogera la informaciión del usuario y la guarda en la base de datos
router.post('/logout', isNotLoggedIn, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/auth/login');
});

module.exports = router;
