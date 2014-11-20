var express = require('express');
var router = express.Router();
var skins = require('../modules/skins')

/* GET home page. */
router.get('/:username', function(req, res) {
  username = req.params.username
  skins.overlay(username, req.query.overlay, function(image) {
  	console.log(username)
    res.writeHead(200, {
      'Content-Type': 'image/png'
    });
    res.end(image);
  });
});

module.exports = router;
