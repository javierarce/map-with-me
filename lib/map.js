'use strict'

const YAML = require('yaml')
const fs = require('fs')
const rss = require('rss')

const sanitize = require('sanitize-html')

const config = require('../config')

module.exports = class Map {
  constructor (db) {
    this.db = db

    this.loadMapConfig()
  }

  loadMapConfig () {
    const mapConfig = fs.readFileSync('./map.yaml', 'utf8')
    config.MAP = YAML.parse(mapConfig).map
    config.ADMIN = YAML.parse(mapConfig).admin
    return config
  }

  onRecreateDB (request, response) {
    if (request.body.secret === process.env.SECRET) {
      this.db.recreateDatabase()
      response.json({ ok: true })
    } else {
      response.json({ ok: false })
    }
  }

  onSaveConfig (request, response) {
    if (request.body.secret !== process.env.SECRET) {
      response.json({ ok: false })
      return
    }

    let map = request.body.map
    let admin = request.body.admin

    let data = {
      map: {
        DEFAULT_SEARCH_LOCATION: map.default_search_location,
        LAT: map.lat,
        LON: map.lon,
        ZOOM: map.zoom,
        FIT_BOUNDS: false
      }, 
      admin: {
        TITLE: admin.title,
        ADMIN_USERNAME: admin.admin_username,
        MODERATED: admin.moderated,
        PROTECTED: admin.protected,
        ANONYMOUS: admin.anonymous
      }
    }

    let yaml = YAML.stringify(data)

    fs.writeFileSync('map.yaml', yaml, 'utf8')
    response.json({ ok: true })
  }

  onGetConfig (request, response) {
    response.json(this.loadMapConfig())
  }

  onGetStatus (request, response) {
    response.json({ user: request.user, coordinates: request.session.coordinates })
  }

  onGetLocations (request, response) {

    let username = undefined

    if (request.session && request.session.passport) {
      username = request.session.passport.user.username
    }

    let moderated = config.ADMIN.MODERATED
    let admin = config.ADMIN.ADMIN_USERNAME 

    this.db.getLocations({ moderated, admin, username }).then((locations) => {
      response.json({ locations })
    }).catch((e) => {
      response.json({ locations: [] })
    })
  }

  onGetGeoJSON (request, response) {
    this.db.getPublicLocations().then((locations) => {

      let geojson = {
        type: 'FeatureCollection',
        features: []
      }

      locations.forEach((location) => {
        let feature = {
        }

        const title = location.name
        const address = location.address
        const lat = +location.lat
        const lng = +location.lng
        const description = location.description
        const author = location.user ? location.user.username : 'Anonymous'
        const date = new Date(location.updatedAt).toISOString()
        feature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          properties: {
            title,
            address,
            description,
            author,
            date
          }
        }

        geojson.features.push(feature)
      })

      let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ').join('_')
      let filename = `map-with-me-${date}.json`

      response.json(geojson)
    })
  }  
  
  onGetCSV (request, response) {
    this.db.getPublicLocations().then((locations) => {

      let csv = []

      csv.push([ 'title', 'address', 'lat', 'lng', 'description', 'author', 'date' ].join(', '))

      locations.forEach((location) => {

        const title = `"${location.name}"`
        const address = `"${location.address}"`
        const lat = location.lat
        const lng = location.lng
        const description = `"${location.description}"`
        const author = location.user ? location.user.username : 'Anonymous'
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

  onGetRSS (request, response) {
    const domain = request.headers.host
    const URL = `https://${domain}`

    let feed = new rss({
      title: `Map with Me @ ${config.ADMIN.TITLE}`,
      description: config.MAP.DEFAULT_SEARCH_LOCATION,
      feed_url: `${URL}/rss`,
      site_url: URL,
      author: config.ADMIN.ADMIN_USERNAME
    })

    this.db.getLocations({ approved: true }).then((locations) => {
      locations.forEach((location) => {
        const url = `${URL}/l/${location.id}`
        const description = `${location.description} - ${location.address}`
        const title = location.name
        const author = location.user ? location.user.username : 'Anonymous'
        const date = location.updatedAt

        feed.item({ title, description, url, author, date })
      })

      response.setHeader('Content-Type', 'application/rss+xml')
      response.send(feed.xml({ indent: true }))
    })
  }

  onAddLocation (request, response) {
    if (config.ADMIN.PROTECTED) {
      response.json({ error: 'This map is protected' }) 
      return
    }

    this.removeSession(request)

    let username = undefined

    if (request.session && request.session.passport) {
      username = request.session.passport.user.username
    }

    let userId = config.ADMIN.ANONYMOUS ? undefined : (request.user && request.user.id)
    let lat = request.body.coordinates.lat
    let lng = request.body.coordinates.lng

    let address = sanitize(request.body.address)
    let description = sanitize(request.body.description)
    let name = sanitize(request.body.name)
    let approved = !config.ADMIN.MODERATED || config.ADMIN.ADMIN_USERNAME ===  username

    this.db.createLocation({ userId, lng, lat, name, description, address, approved }).then((result) => { 
      let location = result.dataValues
      location.user = request.user
      response.json(location) 
    }).catch((e) => {
      response.json({ error: e }) 
    })
  }

  onRejectLocation (request, response) {
    let id = request.body.id 
    let username = request.session.passport.user.username

    if (username !== config.ADMIN.ADMIN_USERNAME) {
      response.json({ error: 'Unauthorized' }) 
      return
    }

    this.db.rejectLocation({ id }).then((result) => { 
      response.json(result) 
    }).catch((e) => {
      response.json({ error: e }) 
    })
  }

  onApproveLocation (request, response) {
    let id = request.body.id 
    let username = request.session.passport.user.username

    if (username !== config.ADMIN.ADMIN_USERNAME) {
      response.json({ error: 'Unauthorized' }) 
      return
    }

    this.db.approveLocation({ id }).then((result) => { 
      response.json(result) 
    }).catch((e) => {
      response.json({ error: e }) 
    })
  }

  removeSession (request) {
    request.session.coordinates = null
    delete request.session.coordinates
    request.session.coordinates = undefined
  }

  onRemoveSession (request, response) {
    this.removeSession(request)
    response.json({ user: request.user, coordinates: request.session.coordinates })
  }

  onRemoveLocation (request, response) {
    let location = request.body.location
    let id = location.id
    let username = request.session.passport.user.username

    if (( location && location.user && username === (location.user.username) ) || username === config.ADMIN.ADMIN_USERNAME) {
      this.db.removeLocation({ id }).then((result) => { 
        response.json({ id }) 
      }).catch((e) => {
        response.json({ error: e }) 
      })
    } else {
      response.json({ error: 'Unauthorized' }) 
    }
  }

  onSave (request, response) {
    let lat = request.body.coordinates.lat
    let lng = request.body.coordinates.lng
    let zoom = request.body.zoom


    let description = sanitize(request.body.description)
    let name = sanitize(request.body.name)
    let address = sanitize(request.body.address)

    request.session.coordinates = { lat, lng, zoom, name, description, address }

    response.json({ lat, lng, zoom, description, name, address })
  }
}
