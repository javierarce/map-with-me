class Bus {
  constructor ($el) {
    this.$el = $el
    this.events = []
    this.markers = []
    this.user = undefined
  }

  isLoggedIn () {
    return !!(this.user && this.user.username)
  }

  isAdmin () {
    return !!(this.user && this.user.username && config.ADMIN.ADMIN_USERNAME === this.user.username)
  }

  getTitle () {
    return config.ADMIN.TITLE
  }

  getAdminUsername () {
    return config.ADMIN.ADMIN_USERNAME
  }

  isModerated () {
    return config.ADMIN.MODERATED
  }

  isAnonymous () {
    return config.ADMIN.ANONYMOUS
  }

  isProtected () {
    return config.ADMIN.PROTECTED
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

