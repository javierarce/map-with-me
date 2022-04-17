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
