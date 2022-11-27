class Bus {
  constructor ($el) {
    this.$el = $el
    this.events = []
    this.markers = []
    this.user = undefined
    this.config = {}
  }

  isLoggedIn () {
    return !!(this.user && this.user.username)
  }

  isAdmin () {
    return !!(ADMIN_USERNAME && this.user && this.user.username && ADMIN_USERNAME === this.user.username)
  }

  getCoordinates () {
    return [this.config.LAT, this.config.LNG]
  }

  getZoom () {
    return this.config.ZOOM
  }

  getTitle () {
    return TITLE
  }

  getAdminUsername () {
    return ADMIN_USERNAME
  }

  isModerated () {
    return this.config.MODERATED
  }

  isAnonymous () {
    return this.config.ANONYMOUS
  }

  isProtected () {
    return this.config.PROTECTED
  }

  findMarkerById (id) {
    let found = undefined

    for (let i = 0; i < this.markers.length; i++) {
      let marker = this.markers[i]

      if (id ===  marker.options.location.id) {
        found =  marker
        break
      }
    }

    return found
  }

  on (name, callback) {
    this.$el.addEventListener(name, (e) => {
      callback && callback(e.detail)
    })
  }

  emit (name, data) {
    if (!name) {
      console.error('Error: empty name event')
      return
    }

    let event = undefined

    if (data) {
      event = new CustomEvent(name, { detail: data })
    } else {
      event = new Event(name)
    }

    this.events.push(event)
    this.$el.dispatchEvent(event)
  }
}

