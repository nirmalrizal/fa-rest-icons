const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const app = express();

const url = "https://fontawesome.com/cheatsheet";
const PORT = process.env.PORT || 4000;

/* GET home page. */
app.get("/", function(req, res, next) {
  var faIcons = {
    light: [],
    solid: [],
    regular: [],
    brands: [],
    all: []
  };

  request(url, function(error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      $("script").each(function() {
        var text = $(this).html();
        if (text.includes("window.__inline_data__ =")) {
          var sc = text.replace("window.__inline_data__ =", "").trim();
          var json = JSON.parse(sc);
          var data = json[2]["data"];
          data.map(function(d) {
            var styles = d.attributes.styles;
            styles.map(function(s) {
              faIcons[s].push(d.id);
            });
            faIcons["all"].push(d.id);
          });
          res.json(faIcons);
        }
      });
    }
  });
});

app.listen(PORT);
