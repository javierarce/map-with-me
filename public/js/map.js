
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
    window.bus.on('close-popup', this.closePopup.bind(this))
    window.bus.on(config.ACTIONS.ADD_LOCATIONS, this.onAddLocations.bind(this))

    window.bus.on(config.ACTIONS.RELOAD_MAP, this.onReloadMap.bind(this))
    window.bus.on(config.ACTIONS.REMOVE_MARKER, this.onRemoveMarker.bind(this))
    window.bus.on(config.ACTIONS.INVALIDATE_MAP_SIZE, this.invalidateSize.bind(this))
    window.bus.on(config.ACTIONS.SET_VIEW, this.onSetView.bind(this))
    window.bus.on(config.ACTIONS.SHOW_ADDED_LOCATION, this.onShowAddedLocation.bind(this))
    window.bus.on(config.ACTIONS.SHOW_DEFAULT_POINT, this.showDefaultPoint.bind(this))
    window.bus.on(config.ACTIONS.SHOW_SAVED_LOCATION, this.showSavedLocation.bind(this))
    window.bus.on(config.ACTIONS.VISIT_MARKER, this.onVisitMarker.bind(this))
  }

  bindMapEvents () {
    this.map.on('zoomend', this.onZoomEnd.bind(this))
    this.map.on('moveend', this.onMoveEnd.bind(this))
    this.map.on('click', this.onMapClick.bind(this))
  }

  onMoveEnd () {
    if (this.map.event) {
      this.map.event()
      this.map.event = undefined
    } 
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

  onMapClick (e) {
    this.removeMarker()

    this.openPopup(e.latlng)
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

  onAddLocations (locations) {
    locations.reverse().forEach(this.addMarker.bind(this)) 
    window.bus.emit(config.ACTIONS.ON_LOAD)
    this.map.addLayer(this.cluster)
  }

  flattenCoordinates (coordinates) {
    return [coordinates.lat, coordinates.lng]
  }
  
  onShowAddedLocation (location) {
    this.stopLoading()
    this.removeMarker()

    let marker = this.addMarker(location)

    //marker.openPopup()
    //this.popup.showSuccess()
  }

  addMarker (location) {
    if (!location.lat && !location.lng) {
      return
    }

    let coordinates = { lat: location.lat, lng: location.lng }
    let latlng = this.flattenCoordinates(coordinates) 

    let name = location.name
    let description = location.description
    let user = location.user
    let address = location.address
    let zoom = this.map.getZoom()

    this.popup = new Popup(coordinates, { name, description, user, address, readonly: true, zoom })

    let emojis = extractEmojis(description)
    let number = extractNumber(description)

    let icon = this.getIcon({ emojis, number, location })
    let marker = L.marker(latlng, { icon, location })

    marker.on('click', () => {
      window.bus.emit(config.ACTIONS.SELECT_MARKER, marker)
    })

    marker.bindPopup(this.popup.el, { maxWidth: 'auto' })

    window.bus.emit(config.ACTIONS.ADD_MARKER, { location, marker })

    this.cluster.addLayer(marker)
    window.bus.markers.push(marker)

    return marker
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
    let location = marker.getLatLng()
    let latlng = [ location.lat, location.lng ]

    this.map.closePopup()

    this.map.event = () => {
      setTimeout(() => {
        marker.fire('click')
      }, 300)
    }

    if (this.isMarkerInCluster(marker)) {
      this.cluster.zoomToShowLayer(marker)
    } else {
      this.map.setView(latlng, this.map.getZoom(), { animate: true, easeLinearity: .5, duration: 0.250 })
    }

  }

  isMarkerInCluster (marker) {
    let m = this.cluster.getVisibleParent(marker)
    return m && m.getAllChildMarkers
  }

  onSetView (result) {
    this.removeMarker()

    this.coordinates = { lat: result.lat, lng: result.lon }
    let latlng = this.flattenCoordinates(this.coordinates)

    let name = result.display_name.split(',')[0]
    let address = (result && parseAddress(result.address)) || undefined

    this.popup = new Popup(latlng, { name, address })
    let icon = this.getIcon({})

    this.marker = L.marker(latlng, { icon }).bindPopup(this.popup.el, { maxWidth: 'auto' }).addTo(this.map)
    this.marker.openPopup()
    this.map.setView(latlng, result.zoom)
  }

  getIcon ({ location, emojis, number }) {
    let html = ''

    let classNames = [ 'icon' ]

    if (location && !location.approved && window.bus.isModerated()) {
      classNames.push('is-disabled')
    }

    if (number) {
      html = number
      classNames.push('has-order')
    } else if (emojis && emojis.length) {
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

  closePopup () {
    this.map.closePopup()
  }

  removeMarker () {
    this.closePopup()

    if (this.marker) {
      this.marker.remove()
      this.marker = undefined
      return true
    }
  }

  invalidateSize () {
    this.map.invalidateSize(true)
  }

  openPopup (coordinates) {
    let latlng = this.flattenCoordinates(coordinates)
    this.popup = new Popup(coordinates, { geocode: true })

    let icon = this.getIcon({})
    this.marker = L.marker(latlng, { icon })
    this.marker.bindPopup(this.popup.el, { maxWidth: 'auto' })
    this.marker.addTo(this.map)
    this.marker.openPopup()
  }

  addControls () {
    this.map.zoomControl.setPosition('topright')

    L.Control.ToggleExpand = L.Control.extend({
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

  showDefaultPoint () {
    this.map.flyTo([config.MAP.LAT, config.MAP.LNG], config.MAP.ZOOM, {
      animate: true,
      duration: 1
    })
  }

  showSavedLocation (data) {
    this.coordinates = { lat: data.lat, lng: data.lng }
    let latlng = this.flattenCoordinates(this.coordinates)

    let name = data.name
    let description = data.description
    let address = data.address

    this.popup = new Popup(this.coordinates, { name, description, address })

    let icon = this.getIcon({})

    this.marker = L.marker(latlng, { icon }).bindPopup(this.popup.el, { maxWidth: 'auto' }).addTo(this.map)
    this.marker.openPopup()
    this.map.setView(latlng, data.zoom)
  }

  onReloadMap (data) {
    if (!data) {
      return
    }

    let coordinates = { lat: data.lat, lng: data.lng }
    let latlng = this.flattenCoordinates(coordinates) 
    this.map.setView(latlng, data.zoom, { animate: true, easeLinearity: .5, duration: 0.250 })
  }

  onRemoveMarker (id) {
    let index = window.bus.markers.findIndex((item) => { 
      return item.options.location.id === id
    })

    if (index !== -1) {
      let marker = window.bus.markers[index]
      this.map.removeLayer(marker)
      this.cluster.removeLayer(marker)
      window.bus.markers.splice(index, 1)
    } else {
      console.error('Marker not found', window.bus.markers)
    }
  }

  fitBounds () {
    let group = L.featureGroup(window.bus.markers)
    this.map.fitBounds(group.getBounds())
  }

  render () {
    let options = { 
      scrollWheelZoom: true,
      zoomControl: true,
      maxBoundsViscosity: 1.0
    }

    this.map = L.map('map', options).setView([coordinates.LAT, coordinates.LNG], coordinates.ZOOM)

    this.cluster = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false
    })

    this.addControls()

    this.bindMapEvents()

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
      attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
      minZoom: 0
    }).addTo(this.map)
  }
}
