'use strict'

require('dotenv').config()

const { spawn } = require('child_process')
const fs = require('fs')

const path = require('path')
const bodyParser = require('body-parser')

const session = require('express-session')
const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy

const rss = require('rss')
const helmet = require('helmet')

const fetch = require('node-fetch')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const app = express()
const http = require('http').createServer(app)

const Mapper = require('./lib/map')
const Storage = require('./lib/db')

const DB = new Storage()
const Map = new Mapper(DB)


app.use(express.static('public'))
app.use(bodyParser.json())
//app.use(helmet())

app.use(session({ 
  secret: 'my-voice-is-my-passport-verify-me',
  resave: true,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
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
    console.log(twitterID, username, displayName)

    DB.findOrCreate({ twitterID, username, displayName, profileImage }).then((user) => {
      done(null, user)
    })
  }))
}

app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)
app.use(expressLayouts)
app.set('layout', '../layouts/base')

app.use('/emoji-regex', express.static(__dirname + '/node_modules/emoji-regex/'))
app.use('/ejs', express.static(__dirname + '/node_modules/ejs'))
app.use('/leaflet', express.static(__dirname + '/node_modules/leaflet/dist'))
app.use('/leaflet.markercluster', express.static(__dirname + '/node_modules/leaflet.markercluster/dist'))

// API
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

app.get('/', (request, response) => {
  const isDevelopment = process.env.MODE === 'DEVELOPMENT' ? true : false

  response.render('index', { isDevelopment })
})

app.get('/favico.ico', (request, response) => {
})

if (process.env.MODE == 'DEVELOPMENT') {
  fs.watch('./public/js/', (eventType, filename) => {
    console.log(`${eventType}: ${filename}`)
    spawn('./concat')
  })

  fs.watch('./public/css/', (eventType, filename) => {
    console.log(`${eventType}: ${filename}`)
    spawn('./concat')
  })
}

http.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + process.env.PORT)
}) 
