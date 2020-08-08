const keys = require('./keys')

// Express app setup
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())



// Postgres client setup
const { Pool } = require('pg')
const pgClient = new Pool({
  user: keys.pgUser,
  password: keys.pgPassword,
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDatabase
})
pgClient.on('error', () => console.log('Lost postgres connection'))
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err))



// Redis client setup
const redis = require('redis')
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
})
const redisPublisher = redisClient.duplicate()



// Express route handlers
app.get('/', (_, res) => {
  res.send('Hi')
})

app.get('/values/all', async (_, res) => {
  const values = await pgClient.query('SELECT * FROM values')
  res.send(values.rows)
})

app.get('/values/current', async (_, res) => {
  redisClient.hgetall('values', (_, values) => {
    res.send(values)
  })
})

app.post('/values', async (req, res) => {
  const idx = Number(req.body.index)
  if (idx > 45) {
    return res.status(422).send('Index too high')
  }

  redisClient.hset('values', idx, 'Nothing yet!')
  redisPublisher.publish('insert', idx)

  pgClient.query('INSERT INTO values(number) VALUES($1)', [ idx ])

  res.send({ working: true })
})

app.listen(5000, () => console.log('Listening!'))
