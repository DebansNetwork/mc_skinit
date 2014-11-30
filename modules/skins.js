var request = require('request');
var lwip = require('lwip')
exp = {}

exp.overlay = function(username, overlay, helmet, callback) {
  request.get({
    url: "https://crafatar.com/skins/" + username,
    encoding: null,
    timeout: 3000
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      lwip.open(body, "png", function(err, image) {
        manageHelmet(helmet, image, function(image) {
          overlayImage(overlay, image, function(image) {
            image.toBuffer('png', function(err, buffer) {
              callback(buffer);
            });
          });
        });
      });
    }
  });
};

function getOverlay(overlay, image) {
  var pieces = overlay.split('.png');
  console.log(image.height());
  if (image.height() == 32) {
    console.log("using old overlay")
    return pieces[0] + "-old.png"
  } else {
    console.log("using new overlay")
    return overlay;
  }
}

function overlayImage(overlay, image, callback) {
  lwip.open(__dirname + '/../public/images/overlays/'+getOverlay(overlay, image), function(err, overlay_image) {
    image.paste(0, 0, overlay_image, function(err, image) {
      callback(image);
    });
  });
}

function manageHelmet(remove, image, callback) {
  if (remove == "true") {
    console.log("removing helmet")
    removeHelmet(image, function(img) {
      callback(img);
    });
  } else {
    console.log("keeping helmet")
    callback(image);
  }
}


function removeHelmet(image, callback) {
  pixels = []
  for (x = 32; x < 64; x++) {
    for (y = 8; y < 16; y++) {
      pixels.push({"x": x, "y": y})
    }
  }
  for (x = 40; x < 56; x++) {
    for (y = 0; y < 8; y++) {
      pixels.push({"x": x, "y": y})
    }
  }
  function del(n, img) {
    if (n < pixels.length) {
      img.setPixel(pixels[n]['x'], pixels[n]['y'], [0,0,0,0], function(err, img) {
        del(n+1, img);
      });
    } else {
      callback(img);
    }
  }
  del(0, image);
}

module.exports = exp;