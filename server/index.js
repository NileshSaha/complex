const keys = require('./keys');
const {Pool} = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
})
pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
}).on('error', () => console.log('Lost PG Connection!'));


const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();


// Express route handlers

app.get('/', (req, res) => {
  res.send('Hi')
});

app.get('/values/all', async(req, res) => {
  const values = await pgClient.query('SELECT * from values');
  res.send(values.rows());
});

app.get('/values/current', async(req, res) => {
  redisClient.hGetAll('values', (err, values))
  res.send(values);
});

app.post('/values', async(req, res) => {
  const index = req.body.index;
  if (parseInt(index) > 40) {
    return res.status(422).send('Index is too damn high!');
  }
  redisClient.hSet('values', index, 'Nothing yet!')
  redisPublisher.publish('insert', index);

  pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

  res.send({working: true});
});


app.listen(5000, ()=> {
  console.log('Listening on port 5000');
})