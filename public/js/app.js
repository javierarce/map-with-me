class App {
  constructor () {
    this.$el = getElement('.App')

    this.locations = new Locations()

    this.header = new Header()
    this.sidebar = new Sidebar(this.locations)

    this.map = new Map()

    this.getStatus()
    this.bindEvents()
    this.render()
  }

  bindEvents () {
    window.bus.on(config.ACTIONS.LOGIN, this.onLogin.bind(this))
    window.bus.on(config.ACTIONS.START_LOADING, this.onStartLoading.bind(this))
    window.bus.on(config.ACTIONS.STOP_LOADING, this.onStopLoading.bind(this))

    window.bus.on(config.ACTIONS.SHOW_SETTINGS, this.onShowSettings.bind(this))
    window.bus.on(config.ACTIONS.HIDE_SETTINGS, this.onHideSettings.bind(this))

    window.bus.on(config.ACTIONS.SHOW_ABOUT, this.onShowAbout.bind(this))
    window.bus.on(config.ACTIONS.HIDE_ABOUT, this.onHideAbout.bind(this))

    window.bus.on(config.ACTIONS.TOGGLE_DESTROY, this.onToggleDestroy.bind(this))
    window.bus.on(config.ACTIONS.TOGGLE_ALERT, this.onToggleAlert.bind(this))
    window.bus.on(config.ACTIONS.TOGGLE_MAP_SIZE, this.onToggleMapSize.bind(this))

    document.onkeyup = this.onKeyUp.bind(this)
  }

  onKeyUp (e) {
    killEvent(e)

    if (e.keyCode === 27) {
      window.bus.emit(config.ACTIONS.HIDE_ABOUT)
      window.bus.emit(config.ACTIONS.HIDE_SETTINGS)
    }
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
        console.error('Error: empty status or status with no user', result)
        return
      }

      document.body.classList.add('is-loaded')

      window.bus.user = result.user
      window.bus.config = result.config
      window.bus.emit(config.ACTIONS.LOGGED_IN)

      if (result.coordinates) {
        window.bus.emit(config.ACTIONS.SHOW_SAVED_LOCATION, result.coordinates)
      }

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

  onShowSettings () {
    if (this.settings) {
      return
    }

    this.settings = new Settings()
    this.$el.prepend(this.settings.render())
  }

  onHideSettings () {
    if (this.settings) {
      this.settings.hide()
      delete this.settings
    }
  }

  onToggleDestroy () {
    this.showDestroy = !this.showDestroy
  }

  onShowAbout () {
    if (this.about) {
      return
    }

    this.about = new About()
    this.$el.prepend(this.about.render())
  }

  onHideAbout () {
    if (this.about) {
      this.about.hide()
      delete this.about
    }
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

  onLogin ({ coordinates, zoom, name, description, address }) {
    post(config.ENDPOINTS.SAVE, { coordinates, zoom, name, description, address }).then((response) => {
      window.location.href = config.ENDPOINTS.LOGIN_PATH
    })
  }

  render () {
    this.$el.appendChild(this.header.render())
    this.$el.appendChild(this.sidebar.render())
  }
}

window.onload = () => {
  window.bus = new Bus(document.body)
  new App()
}
