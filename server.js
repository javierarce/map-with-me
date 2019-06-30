require('dotenv').config()

const path = require('path')
const express = require('express')
const cmd = require('node-cmd')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const session = require('express-session')
const rss = require('rss')
const sanitize = require('sanitize-html')
const helmet = require('helmet')

const Storage = require('./lib/db')
const DB = new Storage()

const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy
const sassMiddleware = require('node-sass-middleware')

const config = require('./config')
const app = express()

const onWebhook = (req, res) => {
  let hmac = crypto.createHmac('sha1', process.env.SECRET)
  let sig  = `sha1=${hmac.update(JSON.stringify(req.body)).digest('hex')}`

  if (req.headers['x-github-event'] === 'push' && sig === req.headers['x-hub-signature']) {
    cmd.run('chmod 777 ./git.sh'); 

    cmd.get('./git.sh', (err, data) => {  
      if (data) {
        console.log(data)
      }
      if (err) {
        console.log(err)
      }
    })

    cmd.run('refresh')
  }

  return res.sendStatus(200)
}

const onSave = (request, response) =>  {
  let lat = request.body.coordinates.lat
  let lng = request.body.coordinates.lng
  let zoom = request.body.zoom


  let description = sanitize(request.body.description)
  let name = sanitize(request.body.name)
  let address = sanitize(request.body.address)

  request.session.coordinates = { lat, lng, zoom, name, description, address }

  response.json({ lat, lng, zoom, description, name, address })
}

const removeSession = (request) => {
  request.session.coordinates = null
  delete request.session.coordinates
  request.session.coordinates = undefined
}

const onRemoveSession = (request, response) =>  {
  removeSession(request)
  response.json({ user: request.user, coordinates: request.session.coordinates })
}

const onRejectLocation = (request, response) =>  {
  let id = request.body.id 
  let username = request.session.passport.user.username

  if (username !== config.ADMIN.ADMIN_USERNAME) {
    response.json({ error: 'Unauthorized' }) 
    return
  }

  DB.rejectLocation({ id }).then((result) => { 
    response.json(result) 
  }).catch((e) => {
    response.json({ error: e }) 
  })
}

const onApproveLocation = (request, response) =>  {
  let id = request.body.id 
  let username = request.session.passport.user.username

  if (username !== config.ADMIN.ADMIN_USERNAME) {
    response.json({ error: 'Unauthorized' }) 
    return
  }

  DB.approveLocation({ id }).then((result) => { 
    response.json(result) 
  }).catch((e) => {
    response.json({ error: e }) 
  })
}

const onRemoveLocation = (request, response) =>  {
  let location = request.body.location
  let id = location.id
  let username = request.session.passport.user.username

  if (username === location.user.username || username === config.ADMIN.ADMIN_USERNAME) {
    DB.removeLocation({ id }).then((result) => { 
      response.json({ id }) 
    }).catch((e) => {
      response.json({ error: e }) 
    })
  } else {
    response.json({ error: 'Unauthorized' }) 
  }
}

const onAddLocation = (request, response) =>  {

  removeSession(request)

  let username = undefined
  let userId = undefined

  if (config.ADMIN.LOGIN_REQUIRED) {
    if (request.session && request.session.passport) {
      username = request.session.passport.user.username
    }

    userId = request.user.id 
  } else {
    username = 'anon'
  }

  let lat = request.body.coordinates.lat
  let lng = request.body.coordinates.lng

  let address = sanitize(request.body.address)
  let description = sanitize(request.body.description)
  let name = sanitize(request.body.name)
  let approved = !config.ADMIN.MODERATED || config.ADMIN.ADMIN_USERNAME ===  username

  DB.createLocation({ userId, lng, lat, name, description, address, approved }).then((result) => { 
    let location = result.dataValues
    location.user = request.user
    response.json(location) 
  }).catch((e) => {
    response.json({ error: e }) 
  })
}

const onGetStatus = (request, response) =>  {
  response.json({ user: request.user, isAdmin: request.session.isAdmin, coordinates: request.session.coordinates })
}

const onGetLocations = (request, response) =>  {

  let username = undefined

  if (request.session && request.session.passport) {
    username = request.session.passport.user.username
  }

  let approved = config.ADMIN.MODERATED && (config.ADMIN.ADMIN_USERNAME !== username)

  if (request.session.isAdmin) {
    approved = undefined
  }

  DB.getLocations({ approved }).then((locations) => {
    response.json({ locations })
  }).catch((e) => {
    response.json({ locations: [] })
  })
}

const onGetCSV = (request, response) => {
  DB.getLocations({ approved: true }).then((locations) => {

    let csv = []

    csv.push([ 'title', 'address', 'lat', 'lng', 'description', 'author', 'date' ].join(', '))

    locations.forEach((location) => {

      const title = `"${location.name}"`
      const address = `"${location.address}"`
      const lat = location.lat
      const lng = location.lng
      const description = `"${location.description}"`
      const author = location.user.username
      const date = new Date(location.updatedAt).toISOString()

      csv.push([ title, address, lat, lng, description, author, date ].join(', '))
    })

    let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ').join('_')
    let filename = `map-with-me-${date}.csv`

    response.setHeader('Content-Type', 'text/csv')
    response.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    response.status(200).send(csv.join('\n'))
  })
}

const onGetRSS = (request, response) => {
  const domain = request.headers.host
  const URL = `https://${domain}`

  let feed = new rss({
    title: `Map with Me @ ${config.TEXTS.MAIN_TITLE}`,
    description: config.MAP.DEFAULT_SEARCH_LOCATION,
    feed_url: `${URL}/rss`,
    site_url: URL,
    author: config.ADMIN.ADMIN_USERNAME
  })

  DB.getLocations({ approved: true }).then((locations) => {
    locations.forEach((location) => {
      const url = `${URL}/l/${location.id}`
      const description = `${location.description} - ${location.address}`
      const title = location.name
      const author = location.user.username
      const date = location.updatedAt

      feed.item({ title, description, url, author, date })
    })

    response.setHeader('Content-Type', 'application/rss+xml')
    response.send(feed.xml({ indent: true }))
  })
}

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(helmet())
 
app.use(session({ 
  secret: 'my-voice-is-my-passport-verify-me',
  resave: true,
  saveUninitialized: true
}))

app.use(sassMiddleware({
  src: path.join(__dirname, 'src/assets/scss'),
  dest: '/tmp',
  sourceMap: true,
  force: true,
  outputStyle: 'compressed'
}))

app.use(bodyParser.urlencoded({ extended: false }))

if (config.ADMIN.LOGIN_REQUIRED) {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser((user, done) => {
    done(null, user)
  })
  passport.deserializeUser((user, done) => {
    done(null, user)
  })

  passport.use(new TwitterStrategy({
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  }, (token, tokenSecret, profile, done) => {

    let twitterID = profile.id
    let username = profile.username
    let displayName = profile.displayName
    let profileImage = profile._json.profile_image_url_https.replace('_normal', '')

    DB.findOrCreate({ twitterID, username, displayName, profileImage }).then((user) => {
      done(null, user)
    })
  }))
}

app.use('/leaflet', express.static(__dirname + '/node_modules/leaflet/dist'))
app.use(express.static('public'))

app.post('/git', onWebhook)
app.post('/api/add', onAddLocation)
app.post('/api/remove', onRemoveLocation)
app.post('/api/approve', onApproveLocation)
app.post('/api/reject', onRejectLocation)
app.post('/api/save', onSave)

app.get('/api/locations', onGetLocations)
app.get('/api/status', onGetStatus)
app.get('/api/reset', onRemoveSession)

app.get('/rss', onGetRSS)
app.get('/csv', onGetCSV)

app.get('/auth/twitter', passport.authenticate('twitter'))
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }))

app.get('/', function(request, response) {
  if (request.query && request.query.secret && request.query.secret === process.env.SECRET) {
    request.session.isAdmin = true
  }
  response.sendFile(__dirname + '/views/index.html')
})

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})
