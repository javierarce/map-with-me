class Location {
  constructor (data) {
    console.log(data)
    this.location = data.location
    this.user = data.location.user
    this.marker = data.marker

    this.isActive = false
    this.username = this.user && this.user.username
  }

  template () {
    return `
      <div :data-id="${this.location.id}" class="Locations__item">
        <div class="Locations__itemName">${this.location.name}</div>
        <div class="Locations__itemDescription">${this.location.description}</div>
        <div class="Locations__itemAddress">${this.location.address}</div>
          <% if (showFooter) { %>
        <div class="Locations__itemFooter">
          <div class="Locations__itemUser">@<%= username %></div>
          <div class="Locations__itemFooterOptions">
          <% if (showApproveItem) { %><button class="Locations__itemApprove js-approve"><%= approveLabel %></button><% } %>
          <% if (showRemoveItem) { %><button class="Locations__itemRemove js-remove">delete</button><% } %>
          </div>
          <% } %>
        </div>
      </div>
    `
  }

  showFooter () {
    return this.location || this.user
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

  onClickRemove (e) {
    killEvent(e)

    //window.bus.emit(config.ACTIONS.REMOVE_LOCATION, this.marker)

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
    onClick () {
      //if (this.isActive) {
      //return
      //}

      this.activateMarker()
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
    this.$el = createElement({ className: 'Location'})
    let html = ejs.render(this.template(), { username: this.username, showFooter: this.showFooter(), showApproveItem: this.showApproveItem(), showRemoveItem: this.showRemoveItem(), approveLabel: this.getApproveLabel() })
    this.$el.insertAdjacentHTML('beforeend', html)

    let classes = this.itemClass()

    if (classes) {
      this.$el.classList.add(classes)
    }

    this.$el.onclick = this.onClick.bind(this)
    this.$remove = this.$el.querySelector('.js-remove')
    this.$remove.onclick = this.onClickRemove.bind(this)

    return this
  }
}
