var request = require('request');
var cheerio = require('cheerio');

request('https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $('poi_card-display-title').each(function(i, element){
      var a = $(this).prev();
      console.log(a.text());
  });
  }
});