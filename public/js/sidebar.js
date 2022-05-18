class Sidebar {
  constructor () {
    this.locations = new Locations()
    this.locations.get()

    this.bindEvents()
  }

  bindEvents () {
    window.bus.on(config.ACTIONS.ADD_LOCATION, this.onAddLocation.bind(this))
    window.bus.on(config.ACTIONS.SELECT_LOCATION, this.onSelectLocation.bind(this))
    window.bus.on(config.ACTIONS.ADD_MARKER, this.onAddMarker.bind(this))
    window.bus.on(config.ACTIONS.SELECT_MARKER, this.onSelectMarker.bind(this))
  }

  template () {
    return `<div class="Sidebar__content js-content"></div>`
  }

  onAddMarker (locationAndMarkerData) {
    let location = new Card(locationAndMarkerData)
    this.$content.prepend(location.render().$el)
  }

  onAddLocation ({ coordinates, name, description, address }) {
    window.bus.emit(config.ACTIONS.START_LOADING)
    this.locations.add({ coordinates, name, description, address })
  }

  onSelectLocation (location) {
    if (this.savedLocation) {
      this.savedLocation.unselect()
    } 
    this.savedLocation = location
  }

  onSelectMarker (marker) {
    let id = marker.options.location.id
    window.bus.emit(`select-${id}`)
  }

  render () {
    this.$el = createElement({ className: 'Sidebar'})
    this.$el.insertAdjacentHTML('beforeend', this.template())
    this.$content = this.$el.querySelector('.js-content')
    return this.$el
  }
}
