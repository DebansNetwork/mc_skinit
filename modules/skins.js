var request = require('request');
var lwip = require('lwip')
exp = {}

exp.overlay = function(username, overlay, callback) {
  request.get({
    url: "https://crafatar.com/skins/" + username,
    encoding: null,
    timeout: 3000
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      lwip.open(body, "png", function(err, image) {
        lwip.open(__dirname + '/../public/images/overlays/'+overlay, function(err, overlay_image) {
          image.paste(0, 0, overlay_image, function(err, image) {
            image.toBuffer('png', function(err, buffer) {
              callback(buffer);
            });
          });
        });
      });
    }
  });
}

module.exports = exp;