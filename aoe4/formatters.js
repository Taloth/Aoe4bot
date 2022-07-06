const metadata = require('./metadata');

function formatLeaderboard(leaderboard) {
  if (leaderboard.startsWith('rm_')) {
    return 'Ranked ' + leaderboard.substring(3);
  } else if (leaderboard.startsWith('qm_')) {
    return 'QM ' + leaderboard.substring(3);
  } else {
    return leaderboard;
  }
}

function formatRankLevel(rank_level) {
  if (!rank_level)
    return '';
  const sp = rank_level.split('_');

  return sp[0][0].toUpperCase() + sp[1];
}

function formatDuration(elapsed) {
  const minutes = Math.floor(elapsed / 60);
  const hours = Math.floor(elapsed / 60 / 60);
  const days = Math.floor(elapsed / 3600 / 24);

  if (days == 1)
    return `${days} day`;
  if (days > 1)
    return `${days} days`;
  if (hours == 1)
    return `${hours} hour`;
  if (hours > 1)
    return `${hours} hours`;
  return `${minutes} min`;
}

function formatAge(date) {
  const elapsed = (Date.now() - Date.parse(date)) / 1000;
  return formatDuration(elapsed);
}

class NightbotDefaultFormatter {
  constructor(format) {
    this.format = format;
  }

  formatCiv(civ) {
    return metadata.parseCiv(civ).shortName || civ;
  }

  formatMatchPlayer(match, player, short) {
    const mode = (player.modes || {})[match.kind];

    var msg = player.name;
    if (!short && mode && mode.rating) {
      const rank = mode.rank ? `#${mode.rank} ` : '';
      const rank_level = mode.rank_level ? formatRankLevel(mode.rank_level) + ', ' : '';
      msg += ` ${rank}(${rank_level}${mode.rating} Elo)`;
    }

    if (short) {
      msg += ` (${this.formatCiv(player.civilization)})`;
    } else {
      msg += ` - ${this.formatCiv(player.civilization)}`;
    }

    return msg;
  }

  formatMatchTeam(match, team, short) {
    return team.map(p => this.formatMatchPlayer(match, p, short)).join(', ');
  }

  sendError(msg, res) {
    res.send(`Error: ${msg}`);
  }

  sendMatch(match, res) {
    const numTeams = match.teams.length;
    const numPlayers = match.teams.flat().length;
    const useShortFormat = numPlayers > 3; // Keep showing elo for 1v2 games. if we ever get custom.

    var msg;
    if (numTeams == 2) {
      const teamA = this.formatMatchTeam(match, match.teams[0], useShortFormat);
      const teamB = this.formatMatchTeam(match, match.teams[1], useShortFormat);

      msg = `==> ${match.map} <==`;
      if (!match.ongoing) {
        const  team1W = match.teams[0].filter(p => p.result == 'win').length;
        const  team1L = match.teams[0].filter(p => p.result == 'loss').length;
        const  team2W = match.teams[1].filter(p => p.result == 'win').length;
        const  team2L = match.teams[1].filter(p => p.result == 'loss').length;
        if (team1W || team2W) {
          msg = `[${team1W?'W':team1L?'L':'?'}] ${msg} [${team2W?'W':team2L?'L':'?'}]`;
        }
      }
      msg = `${teamA} ${msg} ${teamB}`;
    } else if (numPlayers == numTeams) {
      const teams = match.teams.map(t => this.formatMatchTeam(match, t, true)).join(', ');
      msg = `FFA on ${match.map} between ${teams}`;
    } else {
      const teams = match.teams.map(t => this.formatMatchTeam(match, t, true)).join(' vs ');
      msg = `Custom on ${match.map} between ${teams}`;
    }
    if (match.ongoing) {
        msg += ` [started ${formatAge(match.started_at)} ago]`;
    } else {
        msg += ` [played ${formatAge(match.started_at)} ago]`;
    }

    console.log(`Api Out: ${msg}`);
    res.send(msg);
  }

  sendRank(player, leaderboard, res) {
    const mode = player.modes[leaderboard];

    if (!mode) {
      var msg = `${player.name} is unranked in ${formatLeaderboard(leaderboard)}`;
      res.send(msg);
      return;
    }

    const rank = mode.rank != null ? `rank #${mode.rank}` : 'unranked';
    const rank_level = mode.rank_level ? formatRankLevel(mode.rank_level) + ', ' : '';
    const rating = mode.rating ? ` (${rank_level}${mode.rating} Elo)` : '';
    var msg = `${player.name} is ${rank}${rating}, with ${mode.games_count || 0} game${mode.games_count == 1?'':'s'}`;

    if (mode.games_count) {
      msg += ` (${mode.wins_count}-${mode.losses_count} | ${mode.win_rate}%)`;
    }

    if (Number.isInteger(mode.streak)) {
        const streak = parseInt(mode.streak) < 0 ? "losing" : "win";
        msg += `, on a ${Math.abs(mode.streak)}-game ${streak} streak`;
    }

    if (mode.last_game_at) {
        msg += ` [last played ${formatAge(mode.last_game_at)} ago]`;
    }

    console.log(`Api Out: ${msg}`);
    res.send(msg);
  }

  sendWinRate(winrate, res) {
    var msg = `${winrate.player.name} played ${winrate.games_count} game${winrate.games_count == 1?'':'s'}`;

    if (winrate.games_count) {
      msg += ` (${winrate.wins_count}-${winrate.losses_count} | ${winrate.win_rate}%)`;
    }

    if (winrate.duration) {
      msg += ` totaling ${formatDuration(winrate.duration)}`;
    }

    if (winrate.options.civ) {
      msg += ` with ${metadata.parseCiv(winrate.options.civ).shortName}`;
    }

    if (winrate.options.map) {
      msg += ` on ${winrate.options.map}`;
    }

    if (winrate.opponent) {
      msg += ` vs ${winrate.opponent.name}`;
    }

    if (winrate.options.season) {
      msg += ` in season ${winrate.options.season.number}`;
    } else if (winrate.options.timespan) {
      msg += ` in the last ${formatDuration(winrate.options.timespan)}`;
    } else if (winrate.options.idletime) {
      msg += ` in their last session`;
    }

    if (winrate.pending_games == 1) {
      msg += ` [game ongoing since ${formatAge(winrate.pending_game_started_at)} ago]`;
    } else if (winrate.pending_games > 1) {
      msg += ` [${winrate.pending_games} games ongoing since ${formatAge(winrate.pending_game_started_at)} ago]`;
    } else if (winrate.last_game_at) {
      msg += ` [last played ${formatAge(winrate.last_game_at)} ago]`;
    }

    console.log(`Api Out: ${msg}`);
    res.send(msg);
  }
}

class JsonFormatter {
  constructor(format) {
    this.format = format;
  }

  sendError(msg, res) {
    res.json({ error: msg });
  }

  sendMatch(match, res) {
    res.json(match);
  }

  sendRank(player, leaderboard, res) {
    res.json(player);
  }

  sendWinRate(winrate, res) {
    res.json(winrate);
  }
}

function getFormatter(format) {
  if (!format) {
    return new JsonFormatter(format);
  } else if (format == 'nightbot') {
    return new NightbotDefaultFormatter(format);
  }

  return null;
}

module.exports = {
  getFormatter
};
