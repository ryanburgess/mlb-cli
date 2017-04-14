'use strict';
const gamedayHelper = require( 'gameday-helper' );
const Table = require('cli-table');

module.exports = function mlb(date) {

  // use today's date if none specified
  if(date === undefined){
    var date = new Date();
  }

    // create table layout
    const table = new Table({
        head: ['Teams', 'R', 'H', 'E', 'Status'],
        colWidths: [30, 5, 5, 5, 30]
    });


  gamedayHelper.miniScoreboard( date )
  .then( function( data ){

    data.game.forEach(function(game) {

      const away = game.away_team_name;
      const home = game.home_team_name;

      var homeScore = ''
      var awayScore = ''
      var homeHits = ''
      var awayHits = ''
      var homeErrors = ''
      var awayErrors = ''
      var status = ''

      if (game.status === 'Preview') {
         homeScore = awayScore = homeHits = awayHits = homeErrors = awayErrors = 0 
         status = game.time + ' ' + game.ampm + ' ' + game.time_zone
      } else {
            homeScore = game.home_team_runs;
            awayScore = game.away_team_runs;
            homeHits = game.home_team_hits;
            awayHits = game.away_team_hits;
            homeErrors = game.home_team_errors;
            awayErrors = game.away_team_errors;

        if (game.status === 'Final') {
           status = 'Final'
            if (game.inning !== '9') {
              status += ' ' + game.inning}
         } else {
           if (game.top_inning === 'Y') {
              status = 'Top ' + game.inning 
             } else {
              status = 'Bot ' + game.inning }
         }

     }

      table.push(
        [home + '\n' + away, homeScore + '\n' + awayScore, homeHits + '\n' + awayHits, homeErrors + '\n' + awayErrors, status]
       )
    });
    // output the schedule table
    console.log(table.toString());
  });
};
  
  
