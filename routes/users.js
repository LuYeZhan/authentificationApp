var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/private', function (req, res, next) {
  res.render('private');
});

module.exports = router;
