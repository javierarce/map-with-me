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
      window.bus.emit(config.ACTIONS.SHOW_ADDED_LOCATION, result)
    })
  }
}
