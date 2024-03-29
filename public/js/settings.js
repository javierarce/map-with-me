class Settings extends Modal {
  constructor () {
    super()

    this.secret = 'x'

    this.sendButtonIsEnabled = false
    this.menuSelected = 0
  }

  template () {
    return `
    <div class="Modal__backdrop js-backdrop"></div>
    <div data-action="close" class="Settings__modal has-transition js-inner">
    <div class="Settings__inner">
      <div class="Settings__menuList">
        <button data-action="select-menu" data-id="0" class="Settings__menuItem is-selected">Settings</button>
        <button data-action="select-menu" data-id="1" class="Settings__menuItem">Data</button>
      </div>

      <div class="Settings__menuContent">
        <div class="Settings__menu js-menu is-visible" data-id="0">

      <div class="Settings__content">

        <div class="Settings__form">

        <div class="Settings__section">
          <label for="title">
            <strong class="Input__label">Title</strong>
            <div class="Input__field Settings__field">
              <input id="title" name="title" type="text" class="Input" placeholder="Title">
            </div>
          </label>
          </div>

          <div class="Settings__section">
            <div class="Settings__sectionContent">

              <label for="default_search_location">
                <strong class="Input__label">Search location</strong>
                <div class="Input__field Settings__field">
                  <input id="default_search_location" type="text" name="default_search_location" class="Input" placeholder="Default location">
                </div>
              </label>

              <label for="lng">
                <strong class="Input__label">Longitude</strong>
                <div class="Input__field Settings__field is-small">
                  <input id="lng" type="text" name="lng" class="Input" placeholder="Longitude">
                </div>
              </label>

              <label for="lat">
                <strong class="Input__label">Latitude</strong>
                <div class="Input__field Settings__field is-small">
                  <input id="lat" type="text" name="lat" class="Input" placeholder="Latitude">
                </div>
              </label>

              <label for="zoom">
                <strong class="Input__label">Zoom level</strong>
                <div class="Input__field Settings__field is-small is-small">
                  <input id="zoom" type="text" name="zoom" class="Input" placeholder="Zoom">
                </div>
              </label>

            </div>
          </div>

        <div class="Settings__section">
          <label for="admin">
            <strong class="Input__label">Admin username</strong>
            <div class="Input__field Settings__field is-medium">
              <input id="admin" type="text" name="admin_username" class="Input" placeholder="Admin">
            </div>
          </label>
          </div>

          <div class="Settings__section">
            <strong class="Input__label">Publication settings</strong>

            <div class="Settings__sectionContent">
              <label for="anonymous">
                <div class="Input__field Input__checkbox Settings__field">
                  <div class="Input__checkboxTitle">
                    <input id="anonymous" type="checkbox" name="anonymous"> 
                      <strong class="Input__title">Anonymous</strong> 
                  </div>
                  <div class="Input__hint">Login is not required</div>
                </div>
              </label>

              <label for="moderated">
                <div class="Input__field Input__checkbox Settings__field">
                  <div class="Input__checkboxTitle">
                    <input id="moderated" type="checkbox" name="moderated"> 
                    <strong class="Input__title">Moderated
                    <div class="Tooltip">?  <span class="Tooltip__text">Visit /admin/SECRET to manage the submissions.</span></div>
                    </strong>
                  </div>
                  <div class="Input__hint">Submissions require approval
                  </div>
                </div>
              </label>
            </div>
          </div>

      </div>
        </div>

          <div class="Settings__footer js-save-section">
            <strong class="Input__label">Save settings</strong>
            <div class="Settings__sectionContent">

              <div class="Input__field Settings__field">
                <input data-field="secret" data-action="secret" type="text" class="Input js-secret" placeholder="Enter your secret">
              </div>
              <button data-action="save" class="Button is-bold is-disabled">
              <div class="Settings__spinner Spinner is-small js-spinner"></div>
              Save</button>
            </div>
          </div>

          <div class="Settings__footer">
            <div class="Settings__sectionContent">
            </div>
              <div class="Settings__hint">After changing this configuration, please restart the server.</div>
          </div>
        </div>

        <div class="Settings__menu js-menu" data-id="1">

<div class="Settings__section">
              <div class="Settings__menuTitle">Export data</div>

                <p>Get the map data in a GeoJSON or a CSV format. You can also subscribe to this map via <a href="/rss" title="RSS" target="_blank">RSS</a>.</p>


  <details class="Dropdown">
    <summary data-action="open" class="Dropdown__title">Download the data

<div class="Dropdown__caret"></div>
    </summary>
    <ul class="Dropdown__menu">
      <li class="Dropdown__menuItem"><a href="/geojson" title="Export locations in GeoJSON format" target="_blank">GEOJson</a></li>
      <li class="Dropdown__menuItem"><a href="/csv" title="Export locations in CSV format" target="_blank">CSV</a></li>
    </ul>
  </details>





</div>




        </div>
        
      </div>

  </div>
    </div>
`
  }

  getConfig () {
    get(config.ENDPOINTS.CONFIG)
      .then(this.onGetConfig.bind(this))
      .catch((error) => {
        console.log(error)
      })
  }

  onGetConfig (response) {
    response.json().then((result) => {
      this.$inputs.forEach(($input) => {
        let name = $input.name

        let $field = this.$el.querySelector(`[name="${name}"]`)
        if ($field && $field.type === 'checkbox') {
          $field.checked = result[name.toUpperCase()]
        } else if ($field){
          $field.value = result[name.toUpperCase()]
        }
      })
    })
  }

  onClickDestroy () {
    console.log('destroy')
  }

  onClickShowSecret () {
    this.$saveSection.classList.add('is-hidden')
    this.$fields.secret.focus()
  }

  onClickSave () {
    if (!this.secret) {
      return
    }

    this.$spinner.classList.remove('is-visible')
    window.bus.emit(config.ACTIONS.START_LOADING)

    this.fields = {}

    this.$inputs.forEach(($input) => {
      this.fields[$input.name] = $input.type === 'checkbox' ? $input.checked : $input.value
    })

    const secret = this.secret

    const admin = {
      title: this.fields['title'],
      description: this.fields['description'],
      moderated: this.fields['moderated'],
      anonymous: this.fields['anonymous'],
      protected: this.fields['protected'],
      admin_username: this.fields['admin_username']
    }

    const map = {
      lat: this.fields['lat'],
      lng: this.fields['lng'],
      zoom: this.fields['zoom'],
      default_search_location: this.fields['default_search_location']
    }

    post(config.ENDPOINTS.CONFIG, { secret, admin, map } )
      .then(this.onSaveConfig.bind(this))
      .catch((error) => {
        this.$spinner.classList.add('is-visible')
        console.log(error)
      })
  }

  onSaveConfig (response) {
    response.json().then((result) => {
      this.$spinner.classList.remove('is-visible')

      const data = {
        lat: this.fields['lat'],
        lng: this.fields['lng'],
        zoom: this.fields['zoom'],
        default_search_location: this.fields['default_search_location']
      }

      if (!result.error) {
        window.bus.emit(config.ACTIONS.RELOAD_MAP, data)
      }
      window.bus.emit(config.ACTIONS.STOP_LOADING)
    })
  }

  onEnterSecret (e) {
    this.secret = this.$fields.secret.value
    const $save = this.$buttons.save

    if (this.secret) {
      $save.classList.remove('is-disabled')
    } else {
      $save.classList.add('is-disabled')
    }
  }

  upload (event) {
    killEvent(event)

    let formData = new FormData()
    let file = event.target.files[0]

    formData.append('file', file)

    fetch('/api/upload', {
      method: 'POST',
      body: formData
    }).then((response) => {
      if (response.status === 200) {
        console.log(response)
        window.bus.emit(config.ACTIONS.GET_LOCATIONS)
      }

      response.json().then(data => {
        console.log(data)
      })
        .catch(() => { })
    })

    return false
  }

  selectMenu (e) {
    this.menuSelected = e.target.dataset.id

    if (this.$selectedButton) {
      this.$selectedButton.classList.remove('is-selected')
    }

    this.showMenu()

    this.$selectedButton = e.target
    this.$selectedButton.classList.add('is-selected')
  }

  showMenu () {
    this.$menus.forEach(($menu) => {
      $menu.classList.remove('is-visible')
    })

    this.$menus[this.menuSelected].classList.add('is-visible')
  }

  setDimensions () {
    let $inner = this.$el.querySelector('.js-inner')
    let dimensions = $inner.getBoundingClientRect()
    $inner.style.width = `${dimensions.width}px`
    $inner.style.height = `${dimensions.height}px`
  }

  render () {
    let className = this.className

    this.$el = createElement({ className })
    let html = ejs.render(this.template(), { currentURL: window.location.href })

    this.$el.insertAdjacentHTML('beforeend', html)
    this.$el.onclick = this.onClickOutside.bind(this)

    this.$backdrop = this.$el.querySelector('.js-backdrop')
    this.$backdrop.onclick = this.onClickOutside.bind(this)

    this.$saveSection = this.$el.querySelector('.js-save-section')

    this.$spinner = this.$el.querySelector('.js-spinner')

    this.$secret = this.$el.querySelector('.js-secret')
    this.$secret.onkeyup = this.onEnterSecret.bind(this)


    this.$menus = this.$el.querySelectorAll('.js-menu')

    let $buttons = this.$el.querySelectorAll('[data-action]')
    let $fields = this.$el.querySelectorAll('[data-field]')

    this.$buttons = {}
    this.$fields = {}

    $fields.forEach(($field) => {
      let name = $field.dataset.field
      this.$fields[name] = $field
    })

    $buttons.forEach(($button, index) => {
      let action = $button.dataset.action

      if (action === 'select-menu') {
        if (index === 1) {
          this.$selectedButton = $button
        }
        $button.onclick = this.selectMenu.bind(this)
      } else if (action === 'upload') {
        $button.onchange = this.upload.bind(this)
      } else if (action === 'open') {
        $button.onclick = (e) => {
          killEvent(e)
          this.$open = $button.parentElement
          this.$open.open = !this.$open.open
        }

      } else if (action === 'close') {
        $button.onclick = () => {
          if (this.$open) {
          this.$open.open = false
          }
        }
      } else if (action === 'save') {
        $button.onclick = this.onClickSave.bind(this)
      } else if (action === 'secret') {
        $button.onkeyup = this.onEnterSecret.bind(this)
      }

      this.$buttons[action] = $button
    })

    setTimeout(() => {
      this.$el.classList.add('is-visible')
      this.setDimensions()
    }, 10)


    this.$inputs = this.$el.querySelectorAll('input')
    this.getConfig()

    return this.$el
  }
}


