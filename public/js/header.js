class Header {
  constructor () {
    this.canLogin = false
    this.title = window.bus.getTitle()
    this.loggedIn = false
    this.username = undefined
    this.avatarURL = undefined
    this.canLogin = !window.bus.isAnonymous()
    this.unlogged = this.canLogin && this.loggedIn
    this.allowToLog = this.canLogin && !this.loggedIn

    this.bindEvents()
  }

  template () {
    return `
    <div class="Header__info">
      <button class="Button Header__title js-button">${this.title}</button>
      <Search />
    </div>
    <div class="Header__links js-links">
      <button class="Button Header__linksItem js-about">About</button>
      <button class="Button Header__linksItem js-settings">Config</button>
    </div>
    `
  }

  bindEvents () {
    window.bus.on(config.ACTIONS.LOGGED_IN, this.onLoggedIn.bind(this))
  }

  onClickTitle () {
    window.bus.emit(config.ACTIONS.SHOW_DEFAULT_POINT)
  }

  onClickAbout () {
    window.bus.emit(config.ACTIONS.SHOW_ABOUT)
  }

  onClickSettings () {
    window.bus.emit(config.ACTIONS.SHOW_SETTINGS)
  }

  onClickLogin () {
    if (window.bus.isLoggedIn()) {
      console.log('logout') // TODO
    } else {
      window.location.href = config.ENDPOINTS.LOGIN_PATH
    }
  }

  onLoggedIn () {
    this.loggedIn = window.bus.isLoggedIn()

    if (this.loggedIn) {
      this.avatarURL = window.bus.user.profileImage
      this.username = `@${window.bus.user.username}`
      this.$login.innerHTML = this.username

    }
  }

  render () {
    this.$el = createElement({ className: 'Header'})
    this.$el.insertAdjacentHTML('beforeend', this.template())

    this.$links = this.$el.querySelector('.js-links')

    this.$title = this.$el.querySelector('.js-button')
    this.$title.onclick = this.onClickTitle.bind(this)

    this.$about = this.$el.querySelector('.js-about')
    this.$about.onclick = this.onClickAbout.bind(this)

    this.$settings = this.$el.querySelector('.js-settings')
    this.$settings.onclick = this.onClickSettings.bind(this)

    this.$login = createElement({ elementType: 'button', className: 'Button Header__linksItem', text: 'Log in' })
    this.$login.onclick = this.onClickLogin.bind(this)

    this.$links.appendChild(this.$login)

    return this.$el
  }
}

