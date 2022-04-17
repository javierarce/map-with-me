const MAX_TITLE_LENGTH = 80

class Popup {
  constructor (latlng, options) {
    this.enableSend = true
    this.latlng = latlng
    this.geocode = options.geocode || false
    this.name = options.name
    this.description = options.description
    this.user = options.user
    this.address = options.address
    this.readonly = options.readonly

    this.bindEvents()
    this.render()
  }

  bindEvents () {
    window.bus.on(config.ACTIONS.START_LOADING, this.startLoading.bind(this))
    window.bus.on(config.ACTIONS.STOP_LOADING, this.stopLoading.bind(this))
  }

  startLoading () {
    this.el.getContent().classList.add('is-loading')
  }

  stopLoading () {
    this.el.getContent().classList.remove('is-loading')
  }

  enableSendButton () {
    if (this.el && this.el.getContent()) {
      this.el.getContent().classList.add('can-send')
      this.enableSend = true
    }
  }

  disableSendButton () {
    if (this.el && this.el.getContent()) {
      this.el.getContent().classList.remove('can-send')
      this.enableSend = false
    }
  }

  addLocation () {
    if (!this.enableSend) {
      return
    }

    this.startLoading()

    let coordinates = this.latlng
    let name = this.getName()
    let description = this.getDescription()
    let address = this.getAddress()

    window.bus.emit(config.ACTIONS.ADD_LOCATION, { coordinates, name, description, address })
  }

  showSuccess () {
    this.el.getContent().classList.add('was-successful')

    setTimeout(() => {
      this.hideSuccess()
    }, 1500)
  }

  hideSuccess () {
    this.el.getContent().classList.remove('was-successful')
  }

  focus () {
    this.el.getContent().querySelector('.js-description').focus()
  }

  startLoading () {
    this.el.getContent().classList.add('is-loading')
  }

  stopLoading () {
    this.el.getContent().classList.remove('is-loading')
  }

  startGeocoding () {
    this.startLoading()

    let lat = this.latlng.lat
    let lng = this.latlng.lng
    let extraParams = '&addressdetails=1&namedetails=1&extratags=1&zoom=18&format=json'

    let url = `${config.ENDPOINTS.NOMINATIM}${config.ENDPOINTS.GEOCODE_URL}?lat=${lat}&lon=${lng}${extraParams}`

    get(url)
      .then(this.onGetGeocoding.bind(this))
      .catch((error) => {
        console.error(error)
      })
  }

  onGetGeocoding (response) {
    response.json().then((result) => {
      this.stopLoading()

      let address = (result && this.parseAddress(result.address)) || result.display_name
      let name = (result.namedetails && result.namedetails.name) || address || result.display_name

      this.setName(this.truncate(name, MAX_TITLE_LENGTH))
      this.setAddress(address)
    })
  }

  truncate (text, length = 100) {
    if (!text) {
      return
    }
    return text.length > length ? `${text.substring(0, length)}...` : text
  }

  parseAddress(address) {
    let parts = []

    let tpl = 'road, house_number, city, country'

    tpl.split(', ').forEach((part) => {
      if (address && address[part]) {
        parts.push(address[part])
      }
    })

    return parts.length ? parts.join(', ') : 'Mysterious location'
  }

  setName (text) {
    this.el.getContent().querySelector('.js-name').textContent = text
  }

  setAddress (text) {
    this.el.getContent().querySelector('.js-address').textContent = text
    this.el.getContent().classList.add('has-address')
  }


  getName () {
    return this.el.getContent().querySelector('.js-name').textContent
  }


  getDescription () {
    return this.el.getContent().querySelector('.js-description').value
  }

  getAddress () {
    return this.el.getContent().querySelector('.js-address').textContent
  }

  render () {
    let classNames = []

    if (this.readonly) {
      classNames.push('is-readonly')
    }

    if (this.address) {
      classNames.push('has-address')
    }

    let className = 'Popup'

    this.el = L.popup({
      className
    })

    let content = L.DomUtil.create('div', `Popup__content ${classNames.join(' ')}`)

    let header = L.DomUtil.create('div', 'Popup__header js-name', content)

    if (!this.readonly) {
      header.contentEditable='true'
    }

    header.innerHTML = this.name

    let body = L.DomUtil.create('div', 'Popup__body', content)

    let comment = L.DomUtil.create('div', 'Popup__comment', body)
    let controls = L.DomUtil.create('div', 'Popup__controls', body)

    L.DomUtil.create('div', 'Popup__spinner Spinner', body)
    L.DomUtil.create('div', 'Popup__success', body)

    let description = L.DomUtil.create('div', 'Popup__description js-comment', comment)

    if (this.description) {
      description.innerText = this.description
    }

    let textarea = L.DomUtil.create('textarea', 'Popup__input js-description', comment)
    textarea.setAttribute('placeholder', config.TEXTS.PLACEHOLDER)

    textarea.onkeyup = (e) => {
      let description = this.getDescription()

      if (description.length > 0) {
        this.enableSendButton()
      } else {
        this.disableSendButton()
      }
    }

    if (this.description && this.description.length) {
      textarea.innerText = this.description
      window.bus.emit('enable-send-button')
    }

    let btn = L.DomUtil.create('button', 'Button Popup__button', controls)
    btn.setAttribute('type', 'button')

    let showAddLocation = true

    btn.innerHTML = showAddLocation ? 'Add location' : 'Log in with Twitter'
    btn.onclick =  showAddLocation ? this.addLocation.bind(this) : this.login.bind(this)

    let address = L.DomUtil.create('div', 'Popup__address js-address', body)

    if (this.address) {
      address.innerText = this.address
    }

    this.el.setContent(content)

    if (this.geocode) {
      this.startGeocoding()
    }

    return this.el
  }
}
