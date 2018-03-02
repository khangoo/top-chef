const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
var michelin = require('./michelin');

var michelinID=[];
var michelinDeals=[];
var json2= JSON.stringify(michelinDeals);


function getId(restaurant) {
  var url = 'https://m.lafourchette.com/api/restaurant-prediction?name=' + restaurant.name.replace(/ /g, '_').replace(/&|°/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  request({
        method: 'GET',
        url: url
      }, function(err, response, body) {
        if (err) {
          return reject(err);
        }
        var results = JSON.parse(body);
        results.forEach(function(restaurant_found) {
              if (restaurant.zipcode == restaurant_found.address.postal_code && restaurant.name==restaurant_found.name) {
                  restaurant.id = restaurant_found.id;
                  restaurant.url='https://www.lafourchette.com/restaurant/' + restaurant.name.replace(/ /g, '-').replace(/--+/g, '-') + '/' + restaurant.id;
                  michelinID.push(restaurant);

             }

          })
          var json= JSON.stringify(michelinID);
          fs.writeFile('./fourID.json', json, 'utf8');



        })
      }


function getDeals(restaurant) {
  var url = 'https://m.lafourchette.com/api/restaurant/' + restaurant.id + '/sale-type';
  request({
        method: 'GET',
        url: url
      }, function(err, response, body) {
        if (err) {
          return reject(err);
        }
        var results = JSON.parse(body);
        restaurant.deals = [];
        results.forEach(function(deal) {
          if (deal.title != 'Simple booking') {
            if ('exclusions' in deal) {
              restaurant.deals.push({
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
        if(restaurant.deals.length){
           michelinDeals.push(restaurant)
          }
        var json2= JSON.stringify(michelinDeals);
        fs.writeFile('.fourDeal.json', json2, 'utf8');

      })
  }


jsonfile.readFile('./fourID.json', function(err, resto){
                  for(let i=0; i<112; i++){
                     getDeals(resto[i]);
                    }
           });
