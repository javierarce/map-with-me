const config = {
  MAP: {
    DEFAULT_SEARCH_LOCATION: "",
    LAT: "39",
    LON: "-37",
    ZOOM: "4",
    FIT_BOUNDS: false
  },

  TEXTS: {
    PLACEHOLDER: 'What\'s cool about this place?',
    SEARCH_PLACEHOLDER: 'Search for a place or an address',
    NO_RESULTS_TITLE:  'Oh, no… we couldn’t find "{q}."',
    NO_RESULTS_DESCRIPTION: `<p><strong>Map with Me</strong> uses data from <a href="https://www.openstreetmap.org">OpenStreetMap</a> 
  (a collaborative project which aims to create a free editable map of the world) and that place hasn’t been added yet.</p>
  <p>But the good news is that you can add it to OSM yourself and help improve a free and open map of the world! Visit <a href="https://www.openstreetmap.org">OSM</a>, zoom to an area, and click "edit".</p>`,
  },
  ACTIONS: {
    ADD_LOCATION: 'add-location',
    ADD_LOCATIONS: 'add-locations',
    REMOVE_MARKER: 'remove-marker',
    ADD_MARKER: 'add-marker',
    ADD_MARKERS: 'add-markers',
    INVALIDATE_MAP_SIZE: 'invalidate-size',
    LOGGED_IN: 'logged-in',
    LOGIN: 'login',
    ON_LOAD: 'on-load',
    SELECT_MARKER: 'select-marker',
    SET_VIEW: 'set-view',
    SHOW_ADDED_LOCATION: 'show-added-location',
    SHOW_DEFAULT_POINT: 'show-default-point',
    SHOW_SAVED_LOCATION: 'show-saved-location',
    START_LOADING: 'start-loading',
    STOP_LOADING: 'stop-loading',
    TOGGLE_DESTROY: 'toggle-destroy',
    TOGGLE_ABOUT: 'toggle-about',
    TOGGLE_CONFIG: 'toggle-config',
    TOGGLE_ALERT: 'toggle-alert',
    TOGGLE_MAP_SIZE: 'toggle-map-size',
    VISIT_MARKER: 'visit-marker'
  },
  /* BE CAREFUL WHEN CHANGING THESE SETTINGS */
  ENDPOINTS: {
    ADD: '/api/add',
    REMOVE: '/api/remove',
    APPROVE: '/api/approve',
    REJECT: '/api/reject',
    LOCATIONS: '/api/locations',
    SAVE: '/api/save',
    STATUS: '/api/status',
    CONFIG: '/api/config',
    RECREATE_DB: '/api/recreate',
    NOMINATIM: 'https://nominatim.openstreetmap.org',
    LOGIN_PATH: '/auth/twitter',
    GEOCODE_URL: '/reverse.php',
    SEARCH_URL: '/search.php',
    SEARCH_DETAILS_URL: '/details.php'
  }
}
class Bus {
  constructor ($el) {
    this.$el = $el
    this.events = []
    this.markers = []
  }

  on (name, callback) {
    this.$el.addEventListener(name, (e) => {
      callback && callback(e.detail)
    })
  }

  emit (name, data) {
    let event = undefined

    if (data) {
      event = new CustomEvent(name, { detail: data })
    } else {
      event = new Event(name)
    }

    this.events.push(event)
    this.$el.dispatchEvent(event)
  }
}

class Locations {
  constructor () {
  }

  get () {
    return get(config.ENDPOINTS.LOCATIONS)
      .then(this.onGetLocations.bind(this))
      .catch((error) => {
        console.error(error)
      })
  }

  onGetLocations (response) {
    return response.json().then((result) => {
      this.locations = result.locations
      window.bus.emit(config.ACTIONS.ADD_LOCATIONS, this.locations)
    })
  }


  add ({ coordinates, name, description, address }) {
    post(config.ENDPOINTS.ADD, { coordinates, name, description, address })
      .then(this.onGetAddedLocation.bind(this))
      .catch((error) => {
        console.error(error)
      })
  }

  onGetAddedLocation (response) {
    response.json().then((result) => {
      console.log(result)
      window.bus.emit(config.ACTIONS.SHOW_ADDED_LOCATION, result)
    })
  }
}
const killEvent = (e) => {
  e.stopPropagation()
  e.preventDefault()
}

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}

const createElement = ({ className, html, text, elementType = 'div', type,  ...options }) => {
  let $el = document.createElement(elementType)

  if (type) {
    $el.type = 'text'
  }

  if (html) {
    $el.innerHTML = html
  } else if (text) {
    $el.innerText = text
  }

  className.split(' ').filter(c => c).forEach(name => $el.classList.add(name))

  if (!isEmpty(options)) {
    Object.keys(options).forEach((key) => {
      $el[key] = options[key]
    })
  }

  return $el
}
const addClass = (elementClass, className) => {
  let $element = getElement(`.${elementClass}`)

  if ($element) {
    $element.classList.add(className)
  }
}

const get = (URL, content) => {
  const headers = { 'Content-Type': 'application/json' }
  const method = 'GET'
  const options = { method, headers }

  return fetch(URL, options)
}

const post = (URL, content) => {
  const headers = { 'Content-Type': 'application/json' }
  const method = 'POST'
  const body = JSON.stringify(content)
  const options = { method, headers, body }

  return fetch(URL, options)
}

const getRandomItem = (items) => {
  return items[Math.floor(Math.random()*items.length)]
}

const getElements = (selector) => {
  return document.querySelectorAll(selector)
}

const getElement = (selector) => {
  return document.querySelector(selector)
}

const showLoader = () => {
  addClass('js-loader', 'is-visible')
}

const hideLoader = () => {
  const $loader = getElement('.js-loader')
  $loader.classList.remove('is-visible')
}

const enableSubmitButton = () => {
  const $button = getElement('.js-send')
  $button.classList.remove('is-disabled')
}

const disableSubmitButton = () => {
  const $button = getElement('.js-send')

  if ($button) {
    $button.classList.add('is-disabled')
  }
}

const detectMobile = () => {
window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
}
const MAX_TITLE_LENGTH = 80

class Map {
  constructor () {
    this.bindEvents()
    this.render()

    this.expanded = false
    this.readonly = undefined
    this.coordinates = undefined
    this.options = {}
    this.marker = undefined
    this.enableSend = true
  }

  bindEvents () {
    window.bus.on(config.ACTIONS.ADD_LOCATIONS, this.onAddLocations.bind(this))

    window.bus.on(config.ACTIONS.REMOVE_MARKER, this.onRemoveMarker.bind(this))
    window.bus.on(config.ACTIONS.INVALIDATE_MAP_SIZE, this.invalidateSize.bind(this))
    window.bus.on(config.ACTIONS.SET_VIEW, this.onSetView.bind(this))
    window.bus.on(config.ACTIONS.SHOW_ADDED_LOCATION, this.onShowAddedLocation.bind(this))
    window.bus.on(config.ACTIONS.SHOW_DEFAULT_POINT, this.showDefaultPoint.bind(this))
    window.bus.on(config.ACTIONS.SHOW_SAVED_LOCATION, this.showSavedLocation.bind(this))
    window.bus.on(config.ACTIONS.VISIT_MARKER, this.onVisitMarker.bind(this))
  }

  toggle () {
    this.expanded = !this.expanded

    window.bus.emit(config.ACTIONS.TOGGLE_MAP_SIZE, this.expanded)
    this.toggleControl.getContainer().classList.toggle('is-expanded')

    setTimeout(() => {
      console.log('invalidate')
      window.bus.emit(config.ACTIONS.INVALIDATE_MAP_SIZE)
    }, 200)
  }

  createToggleExpand (opts) {
    return new L.Control.ToggleExpand(opts)
  }

  createZoomOut (opts) {
    return new L.Control.ZoomOut(opts)
  }

  createPopup (coordinates, options = {}) {
    let classNames = []

    if (options.readonly) {
      classNames.push('is-readonly')
    }

    if (options.address) {
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

      if (description.length > 0) {
        this.enableSendButton()
      } else {
        this.disableSendButton()
      }
    }

    if (options.description && options.description.length) {
      textarea.innerText = options.description
      this.enableSendButton()
    }

    let btn = L.DomUtil.create('button', 'Button Popup__button', controls)
    btn.setAttribute('type', 'button')

    let showAddLocation = true

    btn.innerHTML = showAddLocation ? 'Add location' : 'Log in with Twitter'
    btn.onclick =  showAddLocation ? this.addLocation.bind(this) : this.login.bind(this)

    let address = L.DomUtil.create('div', 'Popup__address js-address', body)

    if (options.address) {
      address.innerText = options.address
    }

    this.popup.setContent(content)

    if (options.geocode) {
      this.geocode()
    }

    return this.popup
  }

  startLoading () {
    window.bus.emit(config.ACTIONS.START_LOADING)
    this.popup.getContent().classList.add('is-loading')
  }

  stopLoading () {
    window.bus.emit(config.ACTIONS.STOP_LOADING)
    this.popup.getContent().classList.remove('is-loading')
  }

  setName (text) {
    this.popup.getContent().querySelector('.js-name').textContent = text
  }

  getName () {
    return document.body.querySelector('.js-name').textContent
  }

  getDescription () {
    return document.body.querySelector('.js-description').value
  }

  getAddress () {
    return document.body.querySelector('.js-address').textContent
  }

  setDescription (text) {
    document.body.querySelector('.js-description').value = text

    if (text && text.length) {
      this.enableSendButton()
    }
  }

  setAddress (text) {
    this.popup.getContent().querySelector('.js-address').textContent = text
    this.popup.getContent().classList.add('has-address')
  }

  parseAddress(address) {
    let parts = []

    let tpl = 'road, house_number, city, country'

    tpl.split(', ').forEach((part) => {
      if (address && address[part]) {
        parts.push(address[part])
      }
    })

    return parts.length ? parts.join(', ') : 'Mysterious location'
  }

  onGetGeocoding (response) {
    response.json().then((result) => {
      this.stopLoading()

      let address = (result && this.parseAddress(result.address)) || result.display_name
      let name = (result.namedetails && result.namedetails.name) || address || result.display_name

      this.setName(this.truncate(name, MAX_TITLE_LENGTH))
      this.setAddress(address)
    })
  }

  parseAddress(address) {
    let parts = []

    let tpl = 'road, house_number, city, country'

    tpl.split(', ').forEach((part) => {
      if (address && address[part]) {
        parts.push(address[part])
      }
    })

    return parts.length ? parts.join(', ') : 'Mysterious location'
  }

  geocode () {
    this.startLoading()

    let lat = this.coordinates.lat
    let lng = this.coordinates.lng
    let extraParams = '&addressdetails=1&namedetails=1&extratags=1&zoom=18&format=json'

    let url = `${config.ENDPOINTS.NOMINATIM}${config.ENDPOINTS.GEOCODE_URL}?lat=${lat}&lon=${lng}${extraParams}`

    get(url)
      .then(this.onGetGeocoding.bind(this))
      .catch((error) => {
        console.error(error)
      })
  }


  enableSendButton () {
    if (this.popup && this.popup.getContent()) {
      this.popup.getContent().classList.add('can-send')
      this.enableSend = true
    }
  }

  disableSendButton () {
    if (this.popup && this.popup.getContent()) {
      this.popup.getContent().classList.remove('can-send')
      this.enableSend = false
    }
  }

  addLocation () {
    console.log('sending', this.enableSend)
    if (!this.enableSend) {
      return
    }

    this.startLoading()

    let address = this.getAddress()
    let coordinates = this.coordinates
    let description = this.getDescription()
    let name = this.getName()

    window.bus.emit(config.ACTIONS.ADD_LOCATION, { coordinates, name, description, address })
  }

  addLocations (locations) {
    locations.forEach(this.addMarker.bind(this)) 
    window.bus.emit(config.ACTIONS.ON_LOAD)
    this.map.addLayer(this.cluster)
  }

  addMarker (location) {
    let latlng = [location.lat, location.lng]

    let name = location.name
    let description = location.description
    let user = location.user
    let address = location.address

    this.popup = this.createPopup(latlng, { name, description, user, address, readonly: true })

    let icon = this.getIcon(null, location)
    let marker = L.marker(latlng, { icon, location })

    marker.on('click', () => {
      console.log('click')
      //window.bus.emit(config.ACTIONS.SELECT_MARKER, marker)
    })

    marker.bindPopup(this.popup, { maxWidth: 'auto' })

    this.cluster.addLayer(marker)
    //window.bus.markers.push(marker)
  }

  bindKeys () {
    document.onkeydown = (e) => {
      e = e || window.event

      if (e.keyCode === 27) {
        this.removeMarker()
      }
    }
  }

  onVisitMarker (marker) {
    this.map.setView(marker.getLatLng(), 17, { animate: true, easeLinearity: .5, duration: 0.250 })
    setTimeout(() => {
      marker.fire('click')
    }, 500)
  }

  onSetView (result) {
    this.removeMarker()

    let latlng = [result.lat, result.lon]
    this.coordinates = { lat: latlng[0], lng: latlng[1] }

    let name = result.display_name.split(',')[0]
    let address = (result && this.parseAddress(result.address)) || undefined

    this.popup = this.createPopup(latlng, { name, address })
    let icon = this.getIcon()

    this.marker = L.marker(latlng, { icon }).bindPopup(this.popup, { maxWidth: 'auto' }).addTo(this.map)
    this.marker.openPopup()
    this.map.setView(latlng, result.zoom)
  }

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
  }

  onMapClick (e) {
    if (this.removeMarker()) {
      return
    }

    this.coordinates = e.latlng
    this.openPopup()
  }

  removeMarker () {
    this.map.closePopup()

    if (this.marker) {
      this.marker.remove()
      this.marker = undefined
      return true
    }
  }

  invalidateSize () {
    this.map.invalidateSize(true)
  }

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
  }

  focusOnPopup () {
    this.popup.getContent().querySelector('.js-description').focus()
  }

  truncate (text, length = 100) {
    if (!text) {
      return
    }
    return text.length > length ? `${text.substring(0, length)}...` : text
  }

  addControls () {
    this.map.zoomControl.setPosition('topright')

    L.Control.ToggleExpand = L.Control.extend({
      onRemove: () => { },
      onAdd: (map)  => {
        let div = L.DomUtil.create('div', 'ToggleControl')
        L.DomEvent.on(div, 'click', (e) => {
          killEvent(e)
          L.DomEvent.disableClickPropagation(div)
          this.toggle()
        })
        return div
      }
    })

    L.Control.ZoomOut = L.Control.extend({
      onRemove: () => { },
      onAdd: (map)  => {
        let div = L.DomUtil.create('div', 'ZoomOutControl')
        L.DomEvent.on(div, 'click', (e) => {
          killEvent(e)
          L.DomEvent.disableClickPropagation(div)
          this.removeMarker()
          this.fitBounds()
        })
        return div
      }
    })

    this.toggleControl = this.createToggleExpand({ position: 'topright' }).addTo(this.map)
  }

  onZoomEnd () {
    let zoom = this.map.getZoom()

    if (zoom > 6) {
      if (!this.zoomOutControl) {
        this.zoomOutControl = this.createZoomOut({ position: 'topright' }).addTo(this.map)
      }
    } else {
      if (this.zoomOutControl) {
        this.zoomOutControl.remove()
        this.zoomOutControl = undefined
      }
    }
  }

  showDefaultPoint () {
    this.map.flyTo([config.MAP.LAT, config.MAP.LON], config.MAP.ZOOM, {
      animate: true,
      duration: 1
    })
  }

  onShowAddedLocation (location) {
    this.stopLoading()
    this.removeMarker()

    let name = location.name
    let description = location.description
    let address = location.address
    let user = location.user

    let options = { name, description, address, user, readonly: true }

    this.popup = this.createPopup(this.coordinates, options)

    let emojis = undefined // this.extractEmojis(description)
    let icon = this.getIcon(emojis)
    let marker = L.marker(this.coordinates, { icon, location }).bindPopup(this.popup, { maxWidth: 'auto' }).addTo(this.map)

    window.bus.emit(config.ACTIONS.ADD_MARKER, marker)
    marker.openPopup()

    this.showSuccess()

    setTimeout(() => {
      this.focusOnPopup()
    }, 500)
  }

    showSuccess () {
      this.popup.getContent().classList.add('was-successful')

      setTimeout(() => {
        this.hideSuccess()
      }, 1500)
    }

    hideSuccess () {
      this.popup.getContent().classList.remove('was-successful')
    }

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
  }

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
  }

  onAddLocations (locations) {
    locations.forEach(this.addMarker.bind(this)) 
    window.bus.emit(config.ACTIONS.ON_LOAD)
    this.map.addLayer(this.cluster)
  }

  fitBounds () {
    let group = L.featureGroup(window.bus.markers)
    this.map.fitBounds(group.getBounds())
  }

  addMarker (location) {
    let latlng = [location.lat, location.lng]

    let name = location.name
    let description = location.description
    let user = location.user
    let address = location.address

    this.popup = this.createPopup(latlng, { name, description, user, address, readonly: true })

    let icon = this.getIcon(undefined, location)
    let marker = L.marker(latlng, { icon, location })

    marker.on('click', () => {
      window.bus.emit(config.ACTIONS.SELECT_MARKER, marker)
    })

    marker.bindPopup(this.popup, { maxWidth: 'auto' })

    this.cluster.addLayer(marker)
    window.bus.markers.push(marker)
  }

  onPopupOpen (e) {
    setTimeout(() => {
      let px = this.map.project(e.popup._latlng)
      px.y -= e.popup._container.clientHeight/2 
      this.map.panTo(this.map.unproject(px),{ animate: true })
    }, 800)
  }

  render () {
    let options = { 
      scrollWheelZoom: true,
      zoomControl: true,
      maxBoundsViscosity: 1.0
    }

    this.map = L.map('map', options).setView([config.MAP.LAT, config.MAP.LON], config.MAP.ZOOM)

    this.cluster = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false
    })

    this.addControls()

    this.map.on('zoomend', this.onZoomEnd.bind(this))
    this.map.on('popupopen', this.onPopupOpen.bind(this))
    this.map.on('click', this.onMapClick, this)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
      attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
      minZoom: 0
    }).addTo(this.map)
  }
}
class App {
  constructor () {
    this.map = new Map()
    this.bindEvents()

    this.locations = new Locations()
    this.locations.get()
  }

  bindEvents () {
    window.bus.on(config.ACTIONS.ADD_LOCATION, this.onAddLocation.bind(this))
    window.bus.on(config.ACTIONS.LOGIN, this.onLogin.bind(this))
    window.bus.on(config.ACTIONS.ON_LOAD, this.onLoad.bind(this))
    window.bus.on(config.ACTIONS.START_LOADING, this.onStartLoading.bind(this))
    window.bus.on(config.ACTIONS.STOP_LOADING, this.onStopLoading.bind(this))
    window.bus.on(config.ACTIONS.TOGGLE_DESTROY, this.onToggleDestroy.bind(this))
    window.bus.on(config.ACTIONS.TOGGLE_ABOUT, this.onToggleAbout.bind(this))
    window.bus.on(config.ACTIONS.TOGGLE_CONFIG, this.onToggleConfig.bind(this))
    window.bus.on(config.ACTIONS.TOGGLE_ALERT, this.onToggleAlert.bind(this))
    window.bus.on(config.ACTIONS.TOGGLE_MAP_SIZE, this.onToggleMapSize.bind(this))

    document.onkeyup = this.onKeyUp
  }

  onLoad () {
    document.body.classList.add('is-loaded')
  }
    onStartLoading () {
      document.body.classList.add('is-loading')
    }

    onStopLoading () {
      document.body.classList.remove('is-loading')
    }

    onToggleConfig () {
      this.showConfig = !this.showConfig
    }

    onToggleDestroy () {
      this.showDestroy = !this.showDestroy
    }

    onToggleAbout () {
      this.showAbout = !this.showAbout
    }

  onToggleAlert (title, description, footer) {
    this.showAlert = !this.showAlert
    this.alertTitle = title
    this.alertDescription = description
    this.alertFooter = footer
  }

  onToggleMapSize (value) {
    document.body.classList[value ? 'add' : 'remove']('is-expanded')
  }

  onAddLocation ({ coordinates, name, description, address }) {
    this.locations.add({ coordinates, name, description, address })
  }

  onGetLocations (locations) {
    this.map.addLocations(locations)
  }

  onLogin ({ coordinates, zoom, name, description, address }) {
    this.post(config.ENDPOINTS.SAVE, { coordinates, zoom, name, description, address }).then((response) => {
      window.location.href = config.ENDPOINTS.LOGIN_PATH
    })
  }
}

window.onload = () => {
  window.bus = new Bus(document.body)
  new App()
}
