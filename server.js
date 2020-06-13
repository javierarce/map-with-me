require('dotenv').config()

const path = require('path')
const express = require('express')
const cmd = require('node-cmd')
const bodyParser = require('body-parser')
const session = require('express-session')
const rss = require('rss')
const helmet = require('helmet')

const Mapper = require('./lib/map')
const Storage = require('./lib/db')

const DB = new Storage()
const Map = new Mapper(DB)

const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy

const config = require('./config')

const app = express()

const multer = require('multer')
const multipart = multer()

const sassMiddleware = require('node-sass-middleware')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config.js')

app.use(sassMiddleware({
  src: path.join(__dirname, 'src/assets/scss'),
  dest: '/public',
  sourceMap: true,
  force: true,
  outputStyle: 'compressed'
}))

const devServerEnabled = true

if (devServerEnabled) {
  //reload=true:Enable auto reloading when changing JS files or content
  //timeout=1000:Time from disconnecting from server to reconnecting
  webpackConfig.entry.app.unshift('webpack-hot-middleware/client?reload=true&timeout=1000')

  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

  const compiler = webpack(webpackConfig)

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath
  }))

  app.use(webpackHotMiddleware(compiler))
}


app.use(express.static('public'))
app.use(bodyParser.json())
app.use(helmet())
 
app.use(session({ 
  secret: 'my-voice-is-my-passport-verify-me',
  resave: true,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

if (process.env.CONSUMER_KEY && process.env.CONSUMER_SECRET) {
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
app.use('/leaflet.markercluster', express.static(__dirname + '/node_modules/leaflet.markercluster/dist'))

app.post('/api/recreate', (request, response) => { Map.onRecreateDB(request, response)})

app.post('/api/add', (request, response) => { Map.onAddLocation(request, response)})
app.post('/api/remove', (request, response) => { Map.onRemoveLocation(request, response)})
app.post('/api/approve', (request, response) => { Map.onApproveLocation(request, response)})
app.post('/api/reject', (request, response) => { Map.onRejectLocation(request, response)})
app.post('/api/save', (request, response) => { Map.onSave(request, response)})

app.post('/api/config', (request, response) => { Map.onSaveConfig(request, response)})
app.get('/api/config', (request, response) => { Map.onGetConfig(request, response)})

app.get('/api/locations', (request, response) => { Map.onGetLocations(request, response)})
app.get('/api/status', (request, response) => { Map.onGetStatus(request, response)})
app.get('/api/reset', (request, response) => { Map.onRemoveSession(request, response)})

app.get('/rss', (request, response) => { Map.onGetRSS(request, response)})
app.get('/csv', (request, response) => { Map.onGetCSV(request, response)})
app.get('/geojson', (request, response) => { Map.onGetGeoJSON(request, response)})

app.get('/auth/twitter', passport.authenticate('twitter'))
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }))

app.get('/admin/:secret', function(request, response) {
  let secret = request.params.secret

  if (secret === process.env.SECRET) {
    request.session.passport = {
      user: {
        username: config.ADMIN.ADMIN_USERNAME
      }
    }
  }
  response.redirect('/')
})

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html')
})

app.get('/config', function(request, response) {
  response.sendFile(__dirname + '/public/index.html')
})

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})
