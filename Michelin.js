const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


function get_info(url, callback) {
    request(url, function (error, resp, html) {
        if (!error) {
            const $ = cheerio.load(html);
            var name = $('h1').first().text();
            var adress = $('.thoroughfare').first().text();
            var zipcode = $('.postal-code').first().text();
            var city = $('.locality').first().text();
            var star = $('.michelin-poi-distinctions-list').children('li').first().children('.content-wrapper').text()[0];
            var restaurant = {
                "name": name,
                "zipcode": zipcode,
                "city": city,
                "adress": adress + ' ' + zipcode + ' ' + city,
                "stars": star
            };
            callback(restaurant);
        }
    });
}

function get_url(url, callback) {
    var page_urls = [];
    request(url, function (error, resp, html) {
        if (!error) {
            const $ = cheerio.load(html);
            $('a[class=poi-card-link]').each(function (i, elem) {
                page_urls.push('https://restaurant.michelin.fr' + $(elem).attr('href'));
            });
            callback(page_urls);
        }
    });
}

function get() {
    var url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
    var json = { "starred_restaurants": [] };
        for (let i = 1; i <= 35; i++) {
                url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-' + i;
                  get_url(url, function (urls_array) {
                    urls_array.forEach(function (element) {
                      get_info(element, function (restaurant) {
                        json.starred_restaurants.push(restaurant);
                            fs.writeFile('list.json', JSON.stringify(json.starred_restaurants, null, 4), 'utf8', function (error) { });
                    });
                });
            });
        }
}

module.exports.get = get;
