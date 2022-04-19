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
      <button :data-id="${this.location.id}" class="Locations__item" class="">
        <div class="Locations__itemName">${this.location.name}</div>
        <div class="Locations__itemDescription">${this.location.description}</div>
        <div class="Locations__itemAddress">${this.location.address}</div>
          <% if (showFooter) { %>
        <div class="Locations__itemFooter">
          <div class="Locations__itemUser">@<%= username %></div>
          <div class="Locations__itemFooterOptions">

          <% if (showApproveItem) { %>
            <button class="Locations__itemApprove js-approve"><%= approveLabel %></button>
            <% } %>
          <% if (showRemoveItem) { %>
            <button class="Locations__itemRemove js-remove">delete</button>
          <% } %>
          </div>
          <% } %>
        </div>
      </button>
    `
  }

  showFooter () {
    return this.showApproveItem(this.location || this.user)
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

    let confirmation = confirm('Are you sure you want to delete this location?')

    if (confirmation) {
      let location = this.location

      this.post(config.ENDPOINTS.REMOVE, { location })
        .then(this.onRemoveLocation.bind(this))
        .catch((error) => {
          console.log(error)
        })
    }
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
    console.log()
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

  removeMarker (id) {
    window.bus.emit(config.ACTIONS.REMOVE_MARKER, id)
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

    return this
  }
}
