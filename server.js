'use strict'

require('dotenv').config()

const { spawn } = require('child_process')
const fs = require('fs')

const path = require('path')
const bodyParser = require('body-parser')

const fetch = require('node-fetch')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const app = express()
const http = require('http').createServer(app)

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)
app.use(expressLayouts)
app.set('layout', '../layouts/base')

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
}

http.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + process.env.PORT)
}) 
