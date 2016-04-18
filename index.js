'use strict';
const cheerio = require('cheerio');
const request = require('request');
const Table = require('cli-table');

module.exports = function mlb(date) {
  
  let url = 'http://sports.yahoo.com/mlb/scoreboard/';
  if(date !== undefined){
    url = 'http://sports.yahoo.com/mlb/scoreboard/?date=' + date;
  }
  request({
      method: 'GET',
      url: url
    }, function(err, response, body, callback) {
    if (err) return console.error(err);
    const $ = cheerio.load(body);

    // create table layout
    const table = new Table({
        head: ['Teams', 'R', 'H', 'E', 'Status'],
        colWidths: [30, 5, 5, 5, 30]
    });

    $('.box').each(function() {
      const away = $(this).find('.away th').text().trim();
      const home = $(this).find('.home th').text().trim();
      const status = $(this).find('.links a').text().trim();
      const homeScore = $(this).find('.home').children('.score').text().trim();
      const awayScore = $(this).find('.away').children('.score').text().trim();
      const homeHits = $(this).find('.home').children('.hits').text().trim();
      const awayHits = $(this).find('.away').children('.hits').text().trim();
      const homeErrors = $(this).find('.home').children('.errors').text().trim();
      const awayErrors = $(this).find('.away').children('.errors').text().trim();
      
      if(away !== ''){
        table.push(
          [home + '\n' + away, homeScore + '\n' + awayScore, homeHits + '\n' + awayHits, homeErrors + '\n' + awayErrors, status]
        );
      }
    });

    // output the schedule table
    console.log(table.toString());
  });
};
  
  