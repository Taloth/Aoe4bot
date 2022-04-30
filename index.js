require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const readline = require('readline');
const path = require('path');
const { handleAoe4Match, handleAoe4Rank, handleAoe4WinRate } = require('./aoe4/handlers');

const {
  PORT = 5000,
} = process.env;

function askQuestion(query) {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
      rl.close();
      resolve(ans);
  }))
}

function wrapError(handler) {
  var hdl = handler;
  return (req, res) => {
    hdl(req, res).catch(err => {
      console.log(err.stack);
      res.status(500).send('Internal error');
    });
  }
}

function logRequest(req, res, next)
{
  const nightbotUser = new URLSearchParams(req.headers['nightbot-user'] || '').get('displayName');
  const nightbotChannel = new URLSearchParams(req.headers['nightbot-channel'] || '').get('displayName');
  const by = nightbotChannel ? ` [by ${nightbotUser}@${nightbotChannel}]` : '';
  const startTime = performance.now();
  console.log(`Api Req: ${req.url}${by}`);
  res.once('finish', () => {
    const endTime = performance.now();
    const elapsed = endTime - startTime;
    console.log(`Api Res: ${req.url} (${res.statusCode}, ${elapsed.toFixed(0)} msec)`);
  });
  next();
}

async function run() {
  const app = express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.json())
    .use(logRequest)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/api/aoe4/match', wrapError(handleAoe4Match))
    .get('/api/aoe4/rank', wrapError(handleAoe4Rank))
    .get('/api/aoe4/winrate', wrapError(handleAoe4WinRate))
    .get('/', (req, res) => res.render('pages/index'));

  const serverExpress = createServer(app);

  await new Promise((resolve, reject) => { serverExpress.listen(PORT, () => resolve()); });

  console.log(`Listening on ${ PORT }`);

  await askQuestion('Press any key to close\n');
}

run().then(process.exit);
