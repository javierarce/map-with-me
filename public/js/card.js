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
          <% if (showApproveItem) { %><button class="Card__approve js-approve"><%= approveLabel %></button><% } %>
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

  onClickApprove (e) {
    killEvent(e)
  }

  onClickRemove (e) {
    killEvent(e)

    let confirmation = confirm('Are you sure you want to delete this location?')

    if (confirmation) {
      let location = this.location

      post(config.ENDPOINTS.REMOVE, { location })
        .then(this.onRemoveLocation.bind(this))
        .catch((error) => {
          console.log(error)
        })
    }
  }

  onRemoveLocation (response) {
    response.json().then((result) => {
      if (result && !result.error) {
        this.$el.classList.add('is-hidden')
        this.removeMarker()

        setTimeout(() => {
          this.$el.remove()
        }, 500)
      }
    })
  }

  onToggleApprove (response) {
    response.json().then((result) => {
      if (result) {
        let marker = this.markers.find(marker => marker.options.location.id === result.id)
        marker.options.location.approved = result.approved

        if (result.approved) {
          marker.getElement().classList.remove('is-disabled')
        } else {
          marker.getElement().classList.add('is-disabled')
        }
      }
    })
  }

  select () {
    this.isActive = true
    this.$el.classList.add('is-active')
    window.bus.emit(config.ACTIONS.SELECT_LOCATION, this)
  }

  unselect () {
    this.isActive = false
    this.$el.classList.remove('is-active')
  }

  onClick () {
    if (!this.isActive) {
      this.activateMarker()
      window.bus.emit(config.ACTIONS.SELECT_LOCATION, this)
    }

    window.bus.emit(config.ACTIONS.VISIT_MARKER, this.marker)
  }

  activateMarker () {
    this.isActive = true

    let classes = this.itemClass()

    if (classes) {
      this.$el.classList.add(classes)
    }
  }

  onSelectMarker (marker) {
    this.activateMarker()

    let $item = this.getItemById(marker.options.location.id) 
    $item.scrollIntoView({ behavior: 'smooth' })
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

    return classes.join(' ')
  }

  render () {

    this.$el = createElement({ className: 'Card'})
    this.$el.dataset['id'] = this.location.id

    let html = ejs.render(this.template(), { username: this.username, showFooter: this.showFooter(), showApproveItem: this.showApproveItem(), showRemoveItem: this.showRemoveItem(), approveLabel: this.getApproveLabel() })
    this.$el.insertAdjacentHTML('beforeend', html)

    let classes = this.itemClass()

    if (classes) {
      this.$el.classList.add(classes)
    }

    this.$el.onclick = this.onClick.bind(this)

    this.$remove = this.$el.querySelector('.js-remove')

    if (this.$remove) {
      this.$remove.onclick = this.onClickRemove.bind(this)
    }

    this.$approve = this.$el.querySelector('.js-approve')

    if (this.$approve) {
      this.$approve.onclick = this.onClickApprove.bind(this)
    }

    return this
  }
}
