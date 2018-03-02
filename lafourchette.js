const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const info_mich = JSON.parse(fs.readFileSync("./list.json", "utf8"));
var lafour_ID=[];
var lafour_Deal=[];

for (var i = 0; i < info_mich.length; i++) {
    getId(info_mich[i]);
}

function getId(restaurant) {
  var url = 'https://m.lafourchette.com/api/restaurant-prediction?name=' + encodeURIComponent(restaurant.name);
  request({method: 'GET', url: url
}, function(err, response, html) {
        if (!err) {
        var results = JSON.parse(html);
        results.forEach(function(restau) {
              if (restaurant.zipcode == restau.address.postal_code && restaurant.name==restau.name) {
                  restaurant.id = restau.id;
                  lafour_ID.push(restaurant);
             }
          })
          var json= JSON.stringify(lafour_ID, null, 4);
          fs.writeFile('fourID.json', json, 'utf8');
        }
      })
    }

var info_fourID = JSON.parse(fs.readFileSync("./fourID.json", "utf8"));

for (var i = 0; i < info_fourID.length; i++) {
    getDeals(info_fourID[i]);
}

function getDeals(restaurant) {
  var url = 'https://m.lafourchette.com/api/restaurant/' + restaurant.id + '/sale-type';
  request({method: 'GET', url: url
}, function(err, response, html) {
        if (!err) {
        var results = JSON.parse(html);
        restaurant.deal = [];
        results.forEach(function(deal) {
          if (deal.title != 'Simple booking') {
            if ('exclusions' in deal) {
              restaurant.deal.push({
                title: deal.title,
                exclusions: deal.exclusions ,
                is_menu: deal.is_menu,
                is_special_offer: deal.is_special_offer
              });
            } else {
              restaurant.deals.push({
                title: deal.title,
                is_menu: deal.is_menu,
                is_special_offer: deal.is_special_offer
              });
            }

          }

        })
        lafour_Deal.push(restaurant)
        var json2= JSON.stringify(lafour_Deal, null, 4);
        fs.writeFile('fourDeal.json', json2, 'utf8');

      }
    })
  }
