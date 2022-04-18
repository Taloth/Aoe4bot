const fetch = require('node-fetch');

function fetchAOE4World(path, params) {
  var querystr = new URLSearchParams(params).toString();
  var url = 'https://aoe4world.com/api/v0' + path + (querystr.length ? '?' + querystr : '');

  console.log(`Req: ${url}`);
  return fetch(url)
    .then((resp) => {
      console.log(`Res: ${url} (${resp.status})`);
      // 404 can happen for /games/last
      if (resp.status == 404)
        return null;
      return resp.json();
    })
    .catch((err) => {
      console.log(`Err: ${url}: ${err}`)
      return null;
    });
}

function isValidLeaderboard(leaderboard) {
  if (/^[qr]m_\dv\d$/.test(leaderboard))
    return true;
  else
    return false;
}

async function findPlayerByName(name, leaderboard) {
  if (leaderboard && !isValidLeaderboard(leaderboard))
    return null;

  /*if (leaderboard) {
    const json = await fetchAOE4World('/players/autocomplete', { query: name, leaderboard: leaderboard });
    if (json && json.count && json.players) {
      const player = json.players[0];

      // Restructure to standard format to make things easier for formatter
      player.modes = {};
      player.modes[leaderboard] = {
        "rating": player.rating,
        "rank": player.rank,
        "streak": player.streak,
        "games_count": player.games_count,
        "wins_count": player.wins_count,
        "losses_count": player.losses_count,
        "last_game_at": player.last_game_at,
        "win_rate": player.win_rate,
        "rank_level": player.rank_level
      };
      return player;
    }
  } else*/
  {
    const json = await fetchAOE4World('/players/search', { query: name });
    if (json && json.count && json.players) {
      const player = json.players[0];

      // Restructure to standard format to make things easier for formatter
      player.modes = player.leaderboards;
      delete player.leaderboards;
      return player;
    }
  }

  return null;
}

async function findPlayerByRank(rank, leaderboard) {
  if (!isValidLeaderboard(leaderboard))
    return null;

  const page = 1 + Math.floor(rank / 50);
  const json = await fetchAOE4World(`/leaderboards/${leaderboard}`, { page: page });

  if (json && json.count && json.players) {
    const player = json.players.filter(v => v.rank == rank)[0];
    if (player) {
      // Restructure to standard format to make things easier for formatter
      player.modes = {};
      player.modes[leaderboard] = {
        "rating": player.rating,
        "rank": player.rank,
        "streak": player.streak,
        "games_count": player.games_count,
        "wins_count": player.wins_count,
        "losses_count": player.losses_count,
        "last_game_at": player.last_game_at,
        "win_rate": player.win_rate,
        "rank_level": player.rank_level
      };
      return player;
    }
  }

  return null;
}

async function findPlayerByQuery(query, leaderboard) {
  if (query[0] == '#') {
    const rank = parseInt(query.substring(1));
    return await findPlayerByRank(rank, leaderboard);
  } else {
    return await findPlayerByName(query, leaderboard);
  }
}

async function getPlayer(profileId) {
  if (!Number.isInteger(profileId)) return null;

  const json = await fetchAOE4World(`/players/${profileId}`);

  if (json)
  {
    // Restructure to standard format
    const match = json;

    return match;
  }

  return null;
}

async function getPlayerGames(profileId) {
  if (!Number.isInteger(profileId)) return null;

  const json = await fetchAOE4World(`/players/${profileId}/games`);

  if (json && json.games)
  {
    const games = json.games;

    return games;
  }

  return null;
}

async function getLastMatch(profileId) {
  if (!Number.isInteger(profileId)) return null;

  const json = await fetchAOE4World(`/players/${profileId}/games/last`);

  if (json)
  {
    // Restructure to standard format
    const match = json;

    return match;
  }

  return null;
}

module.exports = {
  findPlayerByName,
  findPlayerByRank,
  findPlayerByQuery,
  getPlayer,
  getPlayerGames,
  getLastMatch
};
