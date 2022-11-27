class Locations {
  constructor () {
    this.locations = []
    this.bindEvents()
  }

  bindEvents () {
    window.bus.on(config.ACTIONS.GET_LOCATIONS, this.get.bind(this))
    window.bus.on(config.ACTIONS.REMOVE_LOCATION, this.onRemoveLocation.bind(this))
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

  onRemoveLocation (id) {
    console.log('TODO', id)
  }

  onGetAddedLocation (response) {
    response.json().then((result) => {
      window.bus.emit(config.ACTIONS.SHOW_ADDED_LOCATION, result)
    })
  }
}
