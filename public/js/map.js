class Map {
  constructor () {
    this.bindEvents()
    this.render()

    this.expanded = false
    this.readonly = undefined
    this.coordinates = undefined
    this.options = {}
    this.marker = undefined
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
      window.bus.emit(config.ACTIONS.INVALIDATE_MAP_SIZE)
    }, 200)
  }

  createToggleExpand (opts) {
    return new L.Control.ToggleExpand(opts)
  }

  createZoomOut (opts) {
    return new L.Control.ZoomOut(opts)
  }

  startLoading () {
    window.bus.emit(config.ACTIONS.START_LOADING)
  }

  stopLoading () {
    window.bus.emit(config.ACTIONS.STOP_LOADING)
  }

  setDescription (text) {
    document.body.querySelector('.js-description').value = text

    if (text && text.length) {
      this.enableSendButton()
    }
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

    this.popup = new Popup(latlng, { name, description, user, address, readonly: true })

    let icon = this.getIcon(null, location)
    let marker = L.marker(latlng, { icon, location })

    marker.on('click', () => {
      window.bus.emit(config.ACTIONS.SELECT_MARKER, marker)
    })

    marker.bindPopup(this.popup.el, { maxWidth: 'auto' })

    this.cluster.addLayer(marker)
    window.bus.markers.push(marker)
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

  parseAddress(address) { // TODO: remove duplication
    let parts = []

    let tpl = 'road, house_number, city, country'

    tpl.split(', ').forEach((part) => {
      if (address && address[part]) {
        parts.push(address[part])
      }
    })

    return parts.length ? parts.join(', ') : 'Mysterious location'
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

    this.popup = new Popup(this.coordinates, options)

    let icon = this.getIcon()
    this.marker = L.marker(this.coordinates, { icon }).bindPopup(this.popup.el, { maxWidth: 'auto' }).addTo(this.map)
    this.marker.openPopup()

    this.map.setView(this.coordinates)

    setTimeout(() => {
      this.popup.focus()
    }, 500)
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

    this.popup = new Popup(this.coordinates, options)

    let emojis = undefined // this.extractEmojis(description)
    let icon = this.getIcon(emojis)
    let marker = L.marker(this.coordinates, { icon, location }).bindPopup(this.popup.el, { maxWidth: 'auto' }).addTo(this.map)

    window.bus.emit(config.ACTIONS.ADD_MARKER, marker)
    marker.openPopup()

    this.popup.showSuccess()

    setTimeout(() => {
      this.popup.focus()
    }, 500)
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
