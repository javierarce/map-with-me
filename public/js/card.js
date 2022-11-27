class Card {
  constructor (data) {
    this.location = data.location
    this.user = data.location.user
    this.marker = data.marker

    this.bindEvents()

    this.isActive = false
    this.username = this.user && this.user.username ? `@${this.user.username}` : 'Anonymous'
  }

  template () {
    return `
        <div class="Card__name">${this.location.name}</div>
        <div class="Card__description">${this.location.description}</div>
        <div class="Card__address">${this.location.address}</div>
          <% if (showFooter) { %>
        <div class="Card__footer">
          <div class="Card__user"><%= username %></div>
          <div class="Card__footerOptions">
          <% if (showApproveItem) { %><button class="Card__approve js-moderate"><%= approveLabel %></button><% } %>
          <% if (showRemoveItem) { %><button class="Card__remove js-remove">delete</button><% } %>
          </div>
         <% } %>
        </div>
    `
  }

  bindEvents () {
    window.bus.on(`select-${this.location.id}`, this.select.bind(this))
  }

  showFooter () {
    return this.username || this.showApproveItem() || this.showRemoveItem()
  }

  showApproveItem () {
    return window.bus.isModerated() && (window.bus.isLoggedIn() && window.bus.user.username === window.bus.getAdminUsername() && !this.isMyMarker())
  }

  showRemoveItem () {
    return window.bus.isLoggedIn() && (this.isMyMarker() || window.bus.isAdmin())
  }

  getApproveLabel () {
    return this.location.approved ? 'reject' : 'approve'
  }

  isMyMarker () {
    return this.user ? (this.user.username === window.bus.user.username) : false
  }

  onClickModerate (e) {
    killEvent(e)

    window.bus.emit(config.ACTIONS.VISIT_MARKER, this.marker)

    const id = this.location.id

    post(this.location.approved ? config.ENDPOINTS.REJECT : config.ENDPOINTS.APPROVE, { id })
      .then(this.onModerated.bind(this))
      .catch((error) => {
        console.error(error)
      })
  }

  onClickRemove (e) {
    killEvent(e)

    let confirmation = confirm('Are you sure you want to delete this location?')

    if (confirmation) {
      let location = this.location

      post(config.ENDPOINTS.REMOVE, { location })
        .then(this.onRemoveLocation.bind(this))
        .catch((error) => {
          console.error(error)
        })
    }
  }

  onRemoveLocation (response) {
    response.json().then((result) => {
      if (result && !result.error) {
        this.$el.classList.add('is-hidden')
        this.removeLocation()
        this.removeMarker()

        setTimeout(() => {
          this.$el.remove()
        }, 500)
      }
    })
  }

  onModerated (response) {
    response.json().then((result) => {
      if (!result) {
        return
      }

      this.location.approved = result.approved

      let marker = window.bus.markers.find(marker => marker.options.location.id === result.id)

      if (marker && marker.getElement()) {
        marker.options.location.approved = this.location.approved
        marker.getElement().classList.toggle('is-disabled', !this.location.approved)
      }

      if (this.location.approved) {
        this.$el.classList.remove('is-rejected')
      } else {
        this.$el.classList.add('is-rejected')
      }

      console.log(this.location.approved, this.$moderate)
      this.$moderate.innerHTML = this.location.approved ? 'reject' : 'approve'
    })
  }

  select () {
    if (!this.isActive) {
      console.log(this.isActive)
      this.$el.scrollIntoView({ behavior: 'smooth' })
      this.isActive = true
      this.$el.classList.add('is-active')
    }
    window.bus.emit(config.ACTIONS.SELECT_LOCATION, this)
  }

  unselect () {
    this.isActive = false
    this.$el.classList.remove('is-active')
  }

  onClick () {
    this.isActive = true
    this.$el.classList.add('is-active')
    window.bus.emit(config.ACTIONS.VISIT_MARKER, this.marker)
    window.bus.emit(config.ACTIONS.SELECT_LOCATION, this)
  }

  removeLocation () {
    window.bus.emit(config.ACTIONS.REMOVE_LOCATION, this.location.id)
  }

  removeMarker () {
    window.bus.emit(config.ACTIONS.REMOVE_MARKER, this.location.id)
  }

  isMarkerRejected () {
    return !this.location.approved
  }

  itemClass () {
    let classes = []

    if (this.isActive) {
      classes.push('is-active')
    }

    if (window.bus.isAdmin() && this.isMarkerRejected()) {
      classes.push('is-rejected')
    }

    return classes
  }

  render () {
    this.$el = createElement({ className: 'Card'})
    this.$el.dataset['id'] = this.location.id

    const username = this.username
    const showFooter = this.showFooter()
    const showApproveItem = this.showApproveItem()
    const showRemoveItem = this.showRemoveItem()
    const approveLabel = this.getApproveLabel()

    let html = ejs.render(this.template(), { username, showFooter, showApproveItem, showRemoveItem, approveLabel })
    this.$el.insertAdjacentHTML('beforeend', html)

    this.itemClass().forEach(className => {
      this.$el.classList.add(className)
    })

    this.$el.onclick = this.onClick.bind(this)

    this.$remove = this.$el.querySelector('.js-remove')

    if (this.$remove) {
      this.$remove.onclick = this.onClickRemove.bind(this)
    }

    this.$moderate = this.$el.querySelector('.js-moderate')

    if (this.$moderate) {
      this.$moderate.onclick = this.onClickModerate.bind(this)
    }

    return this
  }
}
