
const aoe4 = require('./api');
const { getFormatter } = require('./formatters');

// thresholdHours is the number of hours to check. Negative is a sliding window. It defaults to -4, in which case it'll continue counting games when the time between two games don't exceed 4 hours.
async function getPlayerWinRate(player, opponent, thresholdHours) {
  const playerProfileIds = Array.isArray(player) ? player.map(p => p.profile_id) : [ player.profile_id ];

  if (!thresholdHours) {
    thresholdHours = -4;
  }

  // Fetch the first 50 games for all specified profileIds and merge them.
  var games = (await Promise.all(playerProfileIds.map(p => aoe4.getPlayerGames(p)))).filter(v => v !== null).flat().sort((a, b) => b.game_id - a.game_id);

  const stats = {
    player:  Array.isArray(player) ? player[0] : player,
    opponent: opponent,
    games_count: 0,
    wins_count: 0,
    losses_count: 0,
    first_game_at: 0,
    last_game_at: 0,
    win_rate: 100,
    duration: 0
  };

  var now = Date.now();
  var lastgame = games[0] ? Date.parse(games[0].started_at) : Date.now();

  for (const game of games) {

    var gametime = Date.parse(game.started_at);

    if (thresholdHours < 0) {
      if ((lastgame - gametime) > -thresholdHours * 3600000)
        break;
    } else {
      if ((now - gametime) > thresholdHours * 3600000)
        break;
    }

    lastgame = gametime;

    // Skip ongoing games in the calculation
    if (!game.duration)
      continue;

    var playerState = game.teams.flat().filter(p => playerProfileIds.includes(p.player.profile_id))[0]?.player;
    var opponentState;
    if (opponent) {
      opponentState = game.teams.flat().filter(p => p.player.profile_id == opponent.profile_id)[0]?.player;
      if (!opponentState) {
        continue;
      }
    }

    if (!stats.last_game_at) {
      stats.last_game_at = new Date(Date.parse(game.started_at) + (game.duration || 0) * 1000).toISOString();
    }
    stats.first_game_at = game.started_at;
    stats.games_count += 1;
    stats.duration += (game.duration || 0);

    if (playerState.result == "win") {
      stats.wins_count += 1;
    } else if (playerState.result == "loss") {
      stats.losses_count += 1;
    }
  }

  if (stats.losses_count) {
    stats.win_rate = Math.round(1000 * stats.wins_count / (stats.wins_count + stats.losses_count)) / 10;
  }

  return stats;
}

// Description: match returns the last completed ladder game of a particular player
// Notes: Match supports multiple players to be specified as default. Allowing a streamer to have it auto-pick the last match from any of their alts with '&player=12345,89438'.
// Query Params:
// query        rank '#1' or player name 'xyz' to search for
// player       Serves as default player identifier of 'query' is empty. comma separated list of profile_ids, the latest game for any of the specified profiles is used.
// leaderboard  Specifies on which leaderboard to search for the user. 'rm_1v1'/'qm_1v1'/etc
// format       Specifies the format of the output, defaults to json. 'nightbot' is a text output for twitch chat.
async function handleAoe4Match(req, res) {
  const query = req.query.query || '';
  const leaderboard = req.query.leaderboard;
  const format = req.query.format;
  const players = [];
  if (query.length) {
    const player = await aoe4.findPlayerByQuery(query, leaderboard || 'rm_1v1');
    if (player && player.profile_id) {
      players.push(player.profile_id);
    }
  } else if (req.query.player) {
    players.push(...req.query.player.split(',').map(v => parseInt(v)));
  }

  const formatter = getFormatter(format);

  if (!formatter) {
    res.status(400).send('Invalid formatter specified');
    return;
  }

  if (players.length) {
    // Get last match for all player IDs
    const matches = await Promise.all(players.map(p => aoe4.getLastMatch(p, leaderboard)));

    // Get the most recent one
    const match = matches.filter(v => v !== null).sort((a,b) => Date.parse(b.started_at) - Date.parse(a.started_at))[0];

    if (match) {
      formatter.sendMatch(match, res);
    } else {
      const player = await aoe4.getPlayer(players[0]);
      formatter.sendError(`"${player.name}" has no matches`, res);
    }
  } else {
    formatter.sendError('No player found', res);
  }
}

// Description: rank returns the rank and rating of the specified player & leaderboard
// Query Params:
// query        rank '#1' or player name 'xyz' to search for
// player       Serves as default player identifier of 'query' is empty. Must be single profile_id.
// leaderboard  Specifies on which leaderboard to search for the user, and rank/elo from that ladder is used in formatting. 'rm_1v1'/'qm_1v1'/etc
// format       Specifies the format of the output, defaults to json. 'nightbot' is a text output for twitch chat.
async function handleAoe4Rank(req, res) {
  const query = req.query.query || '';
  const leaderboard = req.query.leaderboard || 'rm_1v1';
  const format = req.query.format;
  const playerId = parseInt(req.query.player || '0');
  var player = null;
  if (query.length) {
    player = await aoe4.findPlayerByQuery(query, leaderboard);
  } else if (req.query.player) {
    player = await aoe4.getPlayer(playerId);
  }

  const formatter = getFormatter(format);

  if (!formatter) {
    res.status(400).send('Invalid formatter specified');
    return;
  }

  if (player) {
    formatter.sendRank(player, leaderboard, res);
  } else {
    formatter.sendError('No player found', res);
  }
}

// Description: Winrate returns the winrate in the last gaming session for this particular player or versus.
// Query Params:
// query        rank '#1' or player name 'xyz' to search for. Can also be 'vs xyz'(default vs opponent) or 'abc vs xyz' (one player vs other)
// player       Serves as default player identifier of 'query' is empty. Must be single profile_id.
// leaderboard  Specifies on which leaderboard to search for the user. (Note: this won't filter matches)
// format       Specifies the format of the output, defaults to json. 'nightbot' is a text output for twitch chat.
async function handleAoe4WinRate(req, res) {
  const query = req.query.query || '';
  const leaderboard = req.query.leaderboard || 'rm_1v1';
  const format = req.query.format;

  var player = null;
  var opponent = null;
  if (query.length) {
    var versus = query.split(/ ?vs /);
    if (versus.length == 2 && versus[1].length) {
      if (versus[0].length) {
        // "abc vs def"
        player = [ await aoe4.findPlayerByQuery(versus[0], leaderboard) ];
      } else if (req.query.player) {
        // "vs def"
        // Atm we only need the full data for the first profile
        const profileIds = req.query.player.split(',').map(v => parseInt(v));
        player = [ await aoe4.getPlayer(profileIds[0]), ...profileIds.slice(1).map(p => { return { profile_id: p }}) ];
      }
      opponent = await aoe4.findPlayerByQuery(versus[1], leaderboard);
    } else {
      player = [ await aoe4.findPlayerByQuery(query, leaderboard) ];
    }
  } else if (req.query.player) {
    // Atm we only need the full data for the first profile
    const profileIds = req.query.player.split(',').map(v => parseInt(v));
    player = [ await aoe4.getPlayer(profileIds[0]), ...profileIds.slice(1).map(p => { return { profile_id: p }}) ];
  }

  const formatter = getFormatter(format);

  if (!formatter) {
    res.status(400).send('Invalid formatter specified');
    return;
  }

  if (player.length && player[0]) {
    const winrate = await getPlayerWinRate(player, opponent);
    if (winrate) {
      winrate.player = player[0];
      if (opponent) winrate.opponent = opponent;
      formatter.sendWinRate(winrate, res);
    } else {
      formatter.sendError('No winrate available', res);
    }
  } else {
    formatter.sendError('No player found', res);
  }
}

module.exports = {
  handleAoe4Match,
  handleAoe4Rank,
  handleAoe4WinRate
};
