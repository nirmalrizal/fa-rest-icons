var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var parse = require('shift-parser');
var router = express.Router();

const url = 'https://fontawesome.com/cheatsheet';

/* GET home page. */
router.get('/', function(req, res, next) {

  var faIcons = {
    light: [],
    solid: [],
    regular: [],
    brands: [],
    all: []
  };

  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      $('script').each(function(i, elem) {
        var text = $(this).html();
        if(text.includes("window.__inline_data__ =")){
          var sc = text.replace("window.__inline_data__ =","").trim();
          var json = JSON.parse(sc);
          var data = json[2]['data'];
          data.map(function(d){
            var styles = d.attributes.styles;
            styles.map(function(s){
              faIcons[s].push(d.id);
            });
            faIcons['all'].push(d.id);
          });
          res.send(faIcons);
        }
      });
    }
  });
});

module.exports = router;
