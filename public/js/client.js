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
