class App {
  constructor () {
    this.$el = getElement('.App')

    this.about = new About()
    this.header = new Header()
    this.sidebar = new Sidebar()

    this.map = new Map()
    this.locations = new Locations()

    this.getStatus()
    this.bindEvents()
    this.render()
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

    document.onkeyup = this.onKeyUp.bind(this)
  }

  onKeyUp (e) {
    killEvent(e)

    if (e.keyCode === 27) {
      this.about.hide()
      //this.showAlert = false
      //this.showAbout = false
      //this.showDestroy = false
      //this.showConfig = false
    }
  }

  onLoad () {
    document.body.classList.add('is-loaded')
  }

  getStatus () {
    get(config.ENDPOINTS.STATUS)
      .then(this.onGetStatus.bind(this))
      .catch((error) => {
        console.error(error)
      })
  }

  onGetStatus (response) {
    response.json().then((result) => {
      if (!result && !result.user) {
        return
      }

      window.bus.user = result.user
      window.bus.emit(config.ACTIONS.LOGGED_IN)

      if (result.coordinates) {
        window.bus.emit(config.ACTIONS.SHOW_SAVED_LOCATION, result.coordinates)
      }

    this.locations.get()

    }).catch((error) => {
      console.error(error)
    })
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
    this.about.toggle()
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
    window.bus.emit(config.ACTIONS.START_LOADING)
    this.locations.add({ coordinates, name, description, address })
  }

  onLogin ({ coordinates, zoom, name, description, address }) {
    post(config.ENDPOINTS.SAVE, { coordinates, zoom, name, description, address }).then((response) => {
      window.location.href = config.ENDPOINTS.LOGIN_PATH
    })
  }

  render () {
    this.$el.prepend(this.about.render())
    this.$el.appendChild(this.header.render())
    this.$el.appendChild(this.sidebar.render())
  }
}

window.onload = () => {
  window.bus = new Bus(document.body)
  new App()
}
