'use strict';
const gamedayHelper = require( 'gameday-helper' );
const Table = require('cli-table');

/*
 *
 */
var width = process.stdout.columns;
var height = process.stdout.rows;
var slots = Math.floor(width/50)-1;

/*
 *
 */
const mlb = (date = new Date()) => {
  /*
   *
   */
  var table = new Table({
    colWidths: [50, 50, 50, 50, 50, 50, 50].slice(1, slots+1),
    chars: {
      'top': ''
      , 'top-mid': ''
      , 'top-left': ''
      , 'top-right': ''
      , 'bottom': ''
      , 'bottom-mid': ''
      , 'bottom-left': ''
      , 'bottom-right': ''
      , 'left': ''
      , 'left-mid': ''
      , 'mid': ''
      , 'mid-mid': ''
      , 'right': ''
      , 'right-mid': ''
      , 'middle': ''
    }
  });
  /*
   *
   */
  gamedayHelper.masterScoreboard( date )
  .then( (data) => {
    /*
     *
     */
    if(data.game)
    {
      const games = !(data.game instanceof Array) ? [data.game] : data.game;
      let slot = 0;

      games.forEach( (game) => {

        var home = `${game.home_team_name}`;
        var away = `${game.away_team_name}`;

        const status = game.status.status;
        var state;
        var runs = '0\n0';
        switch(status) {
          case 'Final':
          case 'Cancelled':
          case 'Postponed':
            state = status;
            runs = `${game.linescore.r.home}\n${game.linescore.r.away}`;
          break;
          case 'Preview':
            state = `${game.time}${game.ampm} ${game.time_zone}`;
          break;
          case 'In Progress':
            state = `${game.status.inning_state} ${game.status.inning}\n${game.status.b}-${game.status.s} ${game.status.o} out`;
            runs = `${game.linescore.r.home}\n${game.linescore.r.away}`;
          break;
        }


        let score = new Table({colWidths: [22, 5, 13]});
        score.push([ `${home}\n${away}`, `${runs}`, `${state}` ]);

        switch(slot) {
          case 0:
            table.push([ score ]);
          break;
          default:
            table[table.length-1].push(score);
          break;
        }

        slot == slots ? slot = 0 : slot++;
      });
      process.stdout.write('\x1B[2J\x1B[0f');
      var clear = [];
      for(let n = 0; n < (height-1)-(table.length*4); n++) {clear.push('\n');}
      console.log(`${table.toString()}${clear.join('')}`);
    } else {
      console.log('no games scheduled today');
    }
  })
  .catch( (error) => {
    console.log( error );
  });

}

module.exports = mlb;
