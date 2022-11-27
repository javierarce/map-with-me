class Sidebar {
  constructor (locations) {
    this.bindEvents()
    this.locations = locations
  }

  bindEvents () {
    window.bus.on(config.ACTIONS.REMOVE_LOCATION, this.onRemoveLocation.bind(this))
    window.bus.on(config.ACTIONS.ADD_LOCATION, this.onAddLocation.bind(this))
    window.bus.on(config.ACTIONS.SELECT_LOCATION, this.onSelectLocation.bind(this))
    window.bus.on(config.ACTIONS.ADD_MARKER, this.onAddMarker.bind(this))
    window.bus.on(config.ACTIONS.SELECT_MARKER, this.onSelectMarker.bind(this))
    window.bus.on(config.ACTIONS.LOGGED_IN, this.onLoggedIn.bind(this))
  }

  template () {
    return `<div class="Sidebar__content js-content">
    <div class="Card is-placeholder js-placeholder">Click on the map to add the first location.</div>
    </div>`
  }

  onAddMarker (locationAndMarkerData) {
    let card = new Card(locationAndMarkerData)
    this.$placeholder.classList.add('is-hidden')
    this.$content.prepend(card.render().$el)
  }

  onRemoveLocation (location) {
    //console.log(location, this.locations)
    //if (!this.locations.locations.length) {
      //this.$placeholder.classList.remove('is-hidden')
    //}
  }

  onLoggedIn () {
    this.locations.get()
  }

  onAddLocation ({ coordinates, name, description, address }) {
    this.locations.add({ coordinates, name, description, address })
    window.bus.emit(config.ACTIONS.START_LOADING)
  }

  onSelectLocation (location) {
    if (this.savedLocation && location != this.savedLocation) {
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

    this.$placeholder = this.$el.querySelector('.js-placeholder')

    return this.$el
  }
}
