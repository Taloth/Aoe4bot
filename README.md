
## Introduction

Simple server side wrapper to simplify nightbot commands and query aoe4world.com api.

## License

You're free to Woolooloo if you can pull it off, KEKW

## Examples

### !rank

**Command:** `!rank`   
**Url:** `api/aoe4/rank?query=$(querystring)&player=6943917&leaderboard=rm_1v1&format=nightbot`  
**Description:** Returns the rank and winrate of a player on a particular leaderboard

**Parameters:**   
- `player` optionally specifies the profile id of the default player if query is empty   
- `leaderboard` defaults to `rm_1v1`  
- `query` can be empty, a rank `#1` or a player name.

**Examples:**   
- `!rank` -> "Liquid.DeMusliM" is rank #4 (D3, 1366 Elo), with 56 games (46-10 | 82.1%), on a 5-game win streak [last played 21 min ago]   
- `!rank core` -> "coRe" is rank #12 (D2, 1281 Elo), with 81 games (55-26 | 67.9%), on a 6-game win streak [last played 1 day ago]   
- `!rank #1` -> "Beastyqt" is rank #1 (C1, 1448 Elo), with 50 games (46-4 | 92%), on a 1-game losing streak [last played 19 hours ago]   
- `!rank #51` -> "1puppypaw" is rank #51 (D1, 1174 Elo), with 14 games (12-2 | 85.7%), on a 2-game win streak [last played 7 min ago]
- `!rank alsdkfjasfldkj` -> Error: No player found
- `!rank Serral` -> Serral is unranked, with 0 games

### !match

**Command:** `!match`  
**Url:** `api/aoe4/match?query=$(querystring)&player=6943917,9087979&leaderboard=rm_1v1&format=nightbot`  
**Description:** Returns the last completed match of a player.  

**Parameters:**   
- `player` optionally specifies the comma separated profile ids of the default player(s) if query is empty. (If multiple, the last match will be used, useful for having 1 command for two alt accounts)
- `leaderboard` used to search the player. (Note: match isn't filtered for the particular leaderboard)
- `query` can be empty, a rank `#1` or a player name.

**Examples:**   
- `!match` -> supermoronreallystupid #293 (P3, 1103 Elo) - English ==> Hill and Dale <== Liquid.DeMusliM #4 (D3, 1366 Elo) - Chinese [started 23 min ago]
- `!match core` -> coRe #12 (D2, 1281 Elo) - HRE [W] ==> Hill and Dale <== [L] eswallace #78 (D1, 1151 Elo) - Abbasid [played 1 day ago]
- `!match #1` -> Beastyqt #1 (C1, 1448 Elo) - Delhi [L] ==> Lipany <== [W] Leenock #3 (D3, 1368 Elo) - Abbasid [played 20 hours ago]
- `!match alsdkfjasfldkj` -> Error: No player found
- `!match TheMista` (played a qm_2v2) ->  mYi.TheMista #9 (1931 Elo) - English, paphellas #85 (1661 Elo) - Mongols [W] ==> King of the Hill <== [L] bigboser #1355 (1328 Elo) - French, LaGastonnade #984 (1366 Elo) - Rus [played 4 days ago]

## !winrate

**Command:** `!winrate`  
**Url:** `api/aoe4/winrate?query=$(querystring)&player=6943917,9087979&leaderboard=rm_1v1&format=nightbot`  
**Description:** Returns the winrate of the player in the last playing session (a gap of 4h resets the session), can also be used to display the winrate between players in the same period. (Note: only the last 50 games are retrieved atm.)

**TODO:** threshold of 4 hours should be configurable in the future, so ppl can have 'last 24 hours' or 'last week'

**Parameters:**   
- `player` optionally specifies the comma separated profile ids of the default player(s) if query is empty. (If multiple, the matches of both accounts will be grouped before being evaluated)
- `leaderboard` used to search the player. (Note: match isn't filtered for the particular leaderboard)
- `query` can be empty, a rank `#1` or a player name. Additionally can be `vs abc` (default vs abs) and `abc vs def`.

**Examples:**   
- `!winrate` -> "Liquid.DeMusliM" played 4 games (3-0 | 100%) lasting 1 hour, 29 min ago
- `!winrate vs HuT` -> "Liquid.DeMusliM" played 2 games (2-0 | 100%) lasting 49 min vs "HuT", 1 hour ago
- `!winrate Don Artie` -> "Don Artie" played 7 games (6-1 | 85.7%) lasting 1 hour, 8 hours ago
- `!winrate Don Artie vs Szalami` -> "Don Artie" played 3 games (3-0 | 100%) lasting 57 min vs "Szalami1", 8 hours ago
- `!winrate Don Artie vs PilotElf` -> "Don Artie" played 2 games (1-1 | 50%) lasting 31 min vs "PilotElf8750880", 11 hours ago

**TODO:** Cleanup format, remove double quotes. Omit (0-0 | 100%)

## TODO

- Add `threshold` as query parameter to `winrate` so users can specify what they want.
- Cleanup `!match` output a bit for non 1v1. Atm it already simplifies for more than 2 teams. But 4v4 gets too crowded
- Nice to have: Add `@qm_1v1` support in `!rank` like `!rank DeMuslim @qm_1v1`
