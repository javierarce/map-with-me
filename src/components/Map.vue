<template>
  <div class="Map__container">
    <div class="Map__buttons">
      <button class="Button Button__toggle" :class="toggleButtonClass" @click="toggle"></button>
    </div>
    <div id="map" class="Map"></div>
  </div>
</template>

<script>
import mixins from '../mixins'
import config from '../../config'
import mapConfig from '../../map.yaml'

const emojiRegex = require('emoji-regex')

import * as L from 'leaflet'
require('leaflet.markercluster')

const MAX_TITLE_LENGTH = 80

export default {
  mixins: [mixins],
  data() {
    return {
      cluster: {},
      map: {},
      expanded: false,
      readonly: undefined,
      coordinates: undefined,
      options: {},
      marker: undefined,
      enableSend: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.bindEvents()
      this.init()
    })
  },
  computed: {
    toggleButtonClass () {
      return this.expanded ? 'is-expanded' : undefined
    }
  },
  methods: {
    bindEvents () {
      this.bindKeys()
      window.bus.$off(config.ACTIONS.ADD_LOCATIONS)
      window.bus.$off(config.ACTIONS.REMOVE_MARKER)
      window.bus.$off(config.ACTIONS.INVALIDATE_MAP_SIZE)
      window.bus.$off(config.ACTIONS.SET_VIEW)
      window.bus.$off(config.ACTIONS.SHOW_ADDED_LOCATION)
      window.bus.$off(config.ACTIONS.SHOW_DEFAULT_POINT)
      window.bus.$off(config.ACTIONS.SHOW_SAVED_LOCATION)
      window.bus.$off(config.ACTIONS.VISIT_MARKER)

      window.bus.$on(config.ACTIONS.ADD_LOCATIONS, this.onAddLocations)
      window.bus.$on(config.ACTIONS.REMOVE_MARKER, this.onRemoveMarker)
      window.bus.$on(config.ACTIONS.INVALIDATE_MAP_SIZE, this.invalidateSize)
      window.bus.$on(config.ACTIONS.SET_VIEW, this.onSetView)
      window.bus.$on(config.ACTIONS.SHOW_ADDED_LOCATION, this.onShowAddedLocation)
      window.bus.$on(config.ACTIONS.SHOW_DEFAULT_POINT, this.showDefaultPoint)
      window.bus.$on(config.ACTIONS.SHOW_SAVED_LOCATION, this.showSavedLocation)
      window.bus.$on(config.ACTIONS.VISIT_MARKER, this.onVisitMarker)
    },
    bindKeys () {
      document.onkeydown = (e) => {
        e = e || window.event

        if (e.keyCode === 27) {
          this.removeMarker()
        }
      }
    },
    onVisitMarker (marker) {
      this.map.setView(marker.getLatLng(), 17, { animate: true, easeLinearity: .5, duration: 0.250 })
      setTimeout(() => {
        marker.fire('click')
      }, 500)
    },
    onSetView (result) {
      this.removeMarker()

      let latlng = [result.lat, result.lon]
      this.coordinates = { lat: latlng[0], lng: latlng[1] }

      let name = result.display_name.split(',')[0]
      let address = []

      if (result.address.road) {
        address.push(result.address.road)

        if (result.address.house_number) {
          address.push(result.address.house_number)
        }
      }

      address = address.join(', ')

      this.popup = this.createPopup(latlng, { name, address })
      let icon = this.getIcon()

      this.marker = L.marker(latlng, { icon }).bindPopup(this.popup, { maxWidth: 'auto' }).addTo(this.map)
      this.marker.openPopup()
      this.map.setView(latlng, result.zoom)
    },

    getIcon (emojis, location) {
      let html = ''

      let classNames = [ 'icon' ]

      if (location && !location.approved && window.bus.isModerated()) {
        classNames.push('is-disabled')
      }

      if (emojis && emojis.length) {
        html = emojis[0]
        classNames.push('has-emoji')
      }

      let className = classNames.join(' ')

      return new L.divIcon({
        className,
        html,
        iconSize: [32, 32],
        iconAnchor: new L.Point(16, 0)
      })
    },
    toggle () {
      this.expanded = !this.expanded
      window.bus.$emit(config.ACTIONS.TOGGLE_MAP_SIZE, this.expanded)
      setTimeout(() => {
        window.bus.$emit(config.ACTIONS.INVALIDATE_MAP_SIZE)
      }, 200)
    },
    showDefaultPoint () {
      this.map.flyTo([config.MAP.LAT, config.MAP.LON], config.MAP.ZOOM)
    },
    onShowAddedLocation (location) {
      this.stopLoading()
      this.removeMarker()

      let name = location.name
      let description = location.description
      let address = location.address
      let user = location.user

      let options = { name, description, address, user, readonly: true }

      this.popup = this.createPopup(this.coordinates, options)

      let emojis = this.extractEmojis(description)
      let icon = this.getIcon(emojis)
      let marker = L.marker(this.coordinates, { icon, location }).bindPopup(this.popup, { maxWidth: 'auto' }).addTo(this.map)

      window.bus.$emit(config.ACTIONS.ADD_MARKER, marker)
      marker.openPopup()

      this.showSuccess()

      setTimeout(() => {
        this.focusOnPopup()
      }, 500)
    },
    showSavedLocation (data) {
      let latlng = [data.lat, data.lng]

      this.coordinates = { lat: latlng[0], lng: latlng[1] }
      let name = data.name
      let description = data.description
      let address = data.address

      this.popup = this.createPopup(latlng, { name, description, address })
      let icon = this.getIcon()

      this.marker = L.marker(latlng, { icon }).bindPopup(this.popup, { maxWidth: 'auto' }).addTo(this.map)
      this.marker.openPopup()
      this.map.setView(latlng, data.zoom)
    },
    onRemoveMarker (id) {
      let index = window.bus.markers.findIndex((item) => { 
        return item.options.location.id === id
      })

      if (index !== -1) {
        this.map.removeLayer(window.bus.markers[index])
        this.$delete(window.bus.markers, index)
      } else {
        console.error('Marker not found', window.bus.markers)
      }
    },
    onAddLocations (locations) {
      locations.forEach(this.addMarker.bind(this)) 

      if (window.bus.markers.length) {
        if (config.MAP.FIT_BOUNDS) {
          this.fitBounds()
        }  else {
          window.bus.$emit(config.ACTIONS.ON_LOAD)
        }
      } else {
        window.bus.$emit(config.ACTIONS.ON_LOAD)
      }
      this.map.addLayer(this.cluster)
    },
    fitBounds () {
      let group = L.featureGroup(window.bus.markers)
      this.map.flyToBounds(group.getBounds())
      window.bus.$emit(config.ACTIONS.ON_LOAD)
    },
    addMarker (location) {
      let latlng = [location.lat, location.lng]

      let name = location.name
      let description = location.description
      let user = location.user
      let address = location.address

      this.popup = this.createPopup(latlng, { name, description, user, address, readonly: true })

      let emojis = this.extractEmojis(description)
      let icon = this.getIcon(emojis, location)
      let marker = L.marker(latlng, { icon, location })

      marker.on('click', () => {
        window.bus.$emit(config.ACTIONS.SELECT_MARKER, marker)
      })

      marker.bindPopup(this.popup, { maxWidth: 'auto' })

      this.cluster.addLayer(marker)
      window.bus.markers.push(marker)
    },
    extractEmojis (text) {
      let emojis = []
      const regex = emojiRegex()
      let match

      while (match = regex.exec(text)) {
        emojis.push(match[0])
      }

      return emojis
    },
    init () {
      let options = { 
        scrollWheelZoom: true,
        zoomControl: false,
        maxBoundsViscosity: 1.0,
      }

      this.map = L.map('map', options).setView([config.MAP.LAT, config.MAP.LON], config.MAP.ZOOM)

      this.cluster = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false
      })

      this.map.on('popupopen', (e) => {
        setTimeout(() => {

          let px = this.map.project(e.popup._latlng)
          px.y -= e.popup._container.clientHeight/2 
          this.map.panTo(this.map.unproject(px),{ animate: true })
        }, 800)
      })

      this.map.on('click', this.onMapClick, this)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
        attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
        minZoom: 0
      }).addTo(this.map)
    },

    createPopup (coordinates, options = {}) {
      let classNames = []

      if (window.bus.isLoggedIn()) {
        classNames.push('is-logged')
      } 
      
      if (!window.bus.isLoggedIn() || options.description && options.description.length){
        classNames.push('can-send')
        this.enableSend = true
      }

      if (options.readonly) {
        classNames.push('is-readonly')
      }

      if (options.address || window.bus.isLoggedIn()) {
        classNames.push('has-address')
      }

      let className = 'Popup'

      this.popup = L.popup({
        className
      })

      let content = L.DomUtil.create('div', `Popup__content ${classNames.join(' ')}`)

      let header = L.DomUtil.create('div', 'Popup__header js-name', content)

      if (!options.readonly) {
        header.contentEditable='true'
      }

      header.innerHTML = options.name

      let body = L.DomUtil.create('div', 'Popup__body', content)

      if (!window.bus.isAnonymous() && options.user) {
        let footer = L.DomUtil.create('div', 'Popup__footer', content)

        let user = L.DomUtil.create('a', 'Popup__user', footer)
        user.href= `https://twitter.com/${options.user.username}`
        user.innerText = `@${options.user.username}`
      }

      let comment = L.DomUtil.create('div', 'Popup__comment', body)
      let controls = L.DomUtil.create('div', 'Popup__controls', body)

      L.DomUtil.create('div', 'Popup__spinner Spinner', body)
      L.DomUtil.create('div', 'Popup__success', body)

      let description = L.DomUtil.create('div', 'Popup__description js-comment', comment)

      if (options.description) {
        description.innerText = options.description
      }

      let textarea = L.DomUtil.create('textarea', 'Popup__input js-description', comment)
      textarea.setAttribute('placeholder', config.TEXTS.PLACEHOLDER)

      textarea.onkeyup = (e) => {
        let description = this.getDescription()

        if (window.bus.isLoggedIn()) {
          if (description.length > 0) {
            this.enableSendButton()
          } else {
            this.disableSendButton()
          }
        }
      }

      if (options.description && options.description.length) {
        textarea.innerText = options.description
        this.enableSendButton()
      }

      let btn = L.DomUtil.create('button', 'Button Popup__button', controls)
      btn.setAttribute('type', 'button')

      let showAddLocation = (window.bus.isLoggedIn() || window.bus.isAnonymous())

      btn.innerHTML = showAddLocation ? 'Add location' : 'Log in with Twitter'
      btn.onclick =  showAddLocation ? this.addLocation : this.login

      let address = L.DomUtil.create('div', 'Popup__address js-address', body)

      if (options.address) {
        address.innerText = options.address
      }

      this.popup.setContent(content)

      if (options.geocode) {
        this.geocode()
      }

      return this.popup
    },

    addLocation () {
      if (!this.enableSend) {
        return
      }

      this.startLoading()

      let address = this.getAddress()
      let coordinates = this.coordinates
      let description = this.getDescription()
      let name = this.getName()

      window.bus.$emit(config.ACTIONS.ADD_LOCATION, { coordinates, name, description, address })
    },
    login () {
      this.startLoading()

      let address = this.getAddress()
      let coordinates = this.coordinates
      let description = this.getDescription()
      let name = this.getName()
      let zoom = this.map.getZoom()

      window.bus.$emit(config.ACTIONS.LOGIN, { coordinates, zoom, name, description, address })
    },
    showSuccess () {
      this.popup.getContent().classList.add('was-successful')

      setTimeout(() => {
        this.hideSuccess()
      }, 1500)
    },
    hideSuccess () {
      this.popup.getContent().classList.remove('was-successful')
    },
    startLoading () {
      window.bus.$emit(config.ACTIONS.START_LOADING)
      this.popup.getContent().classList.add('is-loading')
    },
    stopLoading () {
      window.bus.$emit(config.ACTIONS.STOP_LOADING)
      this.popup.getContent().classList.remove('is-loading')
    },
    setName (text) {
      this.popup.getContent().querySelector('.js-name').textContent = text
    },
    enableSendButton () {
      if (this.popup && this.popup.getContent()) {
        this.popup.getContent().classList.add('can-send')
        this.enableSend = true
      }
    },
    disableSendButton () {
      if (this.popup && this.popup.getContent()) {
        this.popup.getContent().classList.remove('can-send')
        this.enableSend = false
      }
    },
    getName () {
      return document.body.querySelector('.js-name').textContent
    },
    getDescription () {
      return document.body.querySelector('.js-description').value
    },
    getAddress () {
      return document.body.querySelector('.js-address').textContent
    },
    setDescription (text) {
      document.body.querySelector('.js-description').value = text

      if (text && text.length) {
        this.enableSendButton()
      }
    },
    setAddress (text) {
      this.popup.getContent().querySelector('.js-address').textContent = text
      this.popup.getContent().classList.add('has-address')
    },
    onGetGeocoding (response) {
      response.json().then((result) => {
        this.stopLoading()

        let address = []

        if (result.address.road) {
          address.push(result.address.road)

          if (result.address.house_number) {
            address.push(result.address.house_number)
          }
        }

        address = address.join(', ')

        let name = result.namedetails.name || address || result.display_name
        address = address || result.display_name

        name = this.truncate(name, MAX_TITLE_LENGTH)
        this.setName(name)
        this.setAddress(address)
      })
    },
    geocode () {
      this.startLoading()

      let lat = this.coordinates.lat
      let lng = this.coordinates.lng
      let extraParams = '&addressdetails=1&namedetails=1&extratags=1&zoom=18&format=json'

      let url = `${config.ENDPOINTS.NOMINATIM}${config.ENDPOINTS.GEOCODE_URL}?lat=${lat}&lon=${lng}${extraParams}`

      this.get(url)
        .then(this.onGetGeocoding.bind(this))
        .catch((error) => {
          console.error(error)
        })
    },
    removeMarker () {
      this.map.closePopup()

      if (this.marker) {
        this.marker.remove()
        this.marker = undefined
        return true
      }
    },
    onMapClick (e) {
      if (this.removeMarker()) {
        return
      }

      if (window.bus.isProtected()) {
        return
      }

      this.coordinates = e.latlng
      this.openPopup()
    },
    focusOnPopup () {
      this.popup.getContent().querySelector('.js-description').focus()
    },
    invalidateSize () {
      this.map.invalidateSize(true)
    },
    openPopup (name, description, options = {}) {
      options = {...options, geocode: true, name, description }

      this.disableSendButton()
      this.popup = this.createPopup(this.coordinates, options)

      let icon = this.getIcon()
      this.marker = L.marker(this.coordinates, { icon }).bindPopup(this.popup, { maxWidth: 'auto' }).addTo(this.map)
      this.marker.openPopup()

      this.map.setView(this.coordinates)

      setTimeout(() => {
        this.focusOnPopup()
      }, 500)
    },
    truncate (text, length = 100) {
      return text.length > length ? `${text.substring(0, length)}...` : text
    }
  }
}
</script>

