class Header {
  constructor () {
    this.title = window.bus.getTitle()
    this.loggedIn = false
    this.username = undefined

    this.bindEvents()
  }

  template () {
    return `
    <div class="Header__info">
      <button class="Button Header__title js-title">${this.title}</button>
      <Search />
    </div>
    <div class="Header__links js-links">
      <button class="Button Header__linksItem js-about">About</button>
      <button class="Button Header__linksItem is-hidden js-settings">Settings</button>
    </div>
    `
  }

  bindEvents () {
    window.bus.on(config.ACTIONS.LOGGED_IN, this.onLoggedIn.bind(this))
  }

  onClickTitle () {
    window.bus.emit(config.ACTIONS.SHOW_DEFAULT_POINT)
  }

  onClickSettings () {
    window.bus.emit(config.ACTIONS.SHOW_SETTINGS)
  }

  onClickAbout () {
    window.bus.emit(config.ACTIONS.SHOW_ABOUT)
  }

  onClickLogin () {
    if (!window.bus.isLoggedIn()) {
      window.location.href = config.ENDPOINTS.LOGIN_PATH
    } else {
      window.location.href = config.ENDPOINTS.LOGOUT_PATH
    }
  }

  onLoggedIn () {
    this.loggedIn = window.bus.isLoggedIn()

    if (this.loggedIn) {
      this.username = `@${window.bus.user.username}`
      this.$login.innerHTML = `${this.username} (logout)`

      if (window.bus.isAdmin()) {
        this.$settings.classList.remove('is-hidden')
      }
    }
  }

  render () {
    this.$el = createElement({ className: 'Header'})
    this.$el.insertAdjacentHTML('beforeend', this.template())

    this.$links = this.$el.querySelector('.js-links')

    this.$title = this.$el.querySelector('.js-title')
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

