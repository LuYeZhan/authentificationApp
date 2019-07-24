var express = require('express');
var router = express.Router();
const { isNotLoggedIn } = require('../middlewares/authMiddlewares.js');
const User = require('../models/User.js');
/* GET users listing. */
router.get('/private', isNotLoggedIn, async (req, res, next) => {
  const userID = req.session.currentUser._id;
  const user = await User.findById(userID).populate('recipes');
  console.log(user);
  res.render('private', user);
});

module.exports = router;
