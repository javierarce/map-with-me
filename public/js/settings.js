class Settings extends Modal {
  constructor () {
    super()

    this.secret= undefined
    this.sendButtonIsEnabled = false
  }

  template () {
    return `
    <div class="Modal__backdrop js-backdrop"></div>
    <div class="Settings__inner has-transition js-inner">
      <div class="Settings__content no-bottom-padding">
        <div class="Settings__spinner Spinner is-small js-spinner"></div>

        <div class="Settings__form">
          <h3 class="Settings__sectionTitle">Configure your map</h3>

          <label for="title">
            <strong class="Input__label">Title</strong>
            <div class="Input__field Settings__field">
              <input id="title" name="title" type="text" class="Input" placeholder="Title">
            </div>
          </label>
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

          <label for="admin">
            <strong class="Input__label">Admin username</strong>
            <div class="Input__field Settings__field is-medium">
              <input id="admin" type="text" name="admin_username" class="Input" placeholder="Admin">
            </div>
          </label>

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

              <label for="protected">
                <div class="Input__field Input__checkbox Settings__field">
                  <div class="Input__checkboxTitle">
                    <input id="protected" type="checkbox" name="protected"> 
                    <strong class="Input__title">Protected</strong> 
                  </div>
                  <div class="Input__hint"> Map is read-only</div>
                </div>
              </label>
            </div>
          </div>

      </div>
        </div>

          <div class="Settings__footer js-save-section">
            <div class="Settings__sectionContent">
              <button class="Button is-bold js-show-secret">Save</button>
            </div>
          </div>

          <div class="Settings__footer js-secret-section is-hidden">

          <label for="title">
            <strong class="Input__label">Enter the secret to save the configuration</strong>
          </label>

            <div class="Settings__sectionContent">
              <div class="Input__field Settings__field">
                <input type="text" class="Input js-secret" placeholder="Secret">
              </div>
              <button class="Button is-bold is-disabled js-save">Save</button>
            </div>
              <div class="Settings__hint">After changing this configuration, please restart the server.</div>
          </div>


      <div class="Settings__dangerZone">
        <div class="Settings__dangerZoneContent">
          Do you want to start again? <button class="Button is-link js-destroy" >Destroy the database</button>
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
    this.$secretSection.classList.remove('is-hidden')
    this.$secret.focus()
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

    let map = {
      lat: this.fields['lat'],
      lng: this.fields['lng'],
      zoom: this.fields['zoom'],
      default_search_location: this.fields['default_search_location']
    }

    let admin = {
      title: this.fields['title'],
      moderated: this.fields['moderated'],
      anonymous: this.fields['anonymous'],
      protected: this.fields['protected'],
      admin_username: this.fields['admin_username']
    }

    let configuration = { secret: this.secret, admin, map }

    post(config.ENDPOINTS.CONFIG, configuration )
      .then(this.onSaveConfig.bind(this))
      .catch((error) => {
        this.$spinner.classList.add('is-visible')
        console.log(error)
      })
  }

  onSaveConfig (response) {
    response.json().then((result) => {
      this.$spinner.classList.remove('is-visible')

    let map = {
      lat: this.fields['lat'],
      lng: this.fields['lng'],
      zoom: this.fields['zoom'],
      default_search_location: this.fields['default_search_location']
    }

      window.bus.emit(config.ACTIONS.RELOAD_MAP, map)
      window.bus.emit(config.ACTIONS.STOP_LOADING)
    })
  }

  onEnterSecret (e) {
    this.secret = this.$secret.value
    if (this.secret) {
      this.$save.classList.remove('is-disabled')
    } else {
      this.$save.classList.add('is-disabled')
    }
  }

  render () {
    let className = this.className

    this.$el = createElement({ className })
    let html = ejs.render(this.template(), { currentURL: window.location.href })

    this.$el.insertAdjacentHTML('beforeend', html)
    this.$el.onclick = this.onClickOutside.bind(this)

    this.$backdrop = this.$el.querySelector('.js-backdrop')
    this.$backdrop.onclick = this.onClickOutside.bind(this)

    this.$secretSection = this.$el.querySelector('.js-secret-section')
    this.$saveSection = this.$el.querySelector('.js-save-section')

    this.$spinner = this.$el.querySelector('.js-spinner')

    this.$secret = this.$el.querySelector('.js-secret')
    this.$secret.onkeyup = this.onEnterSecret.bind(this)

    this.$destroy = this.$el.querySelector('.js-destroy')
    this.$destroy.onclick = this.onClickDestroy.bind(this)

    this.$showSecret = this.$el.querySelector('.js-show-secret')
    this.$showSecret.onclick = this.onClickShowSecret.bind(this)

    this.$save = this.$el.querySelector('.js-save')
    this.$save.onclick = this.onClickSave.bind(this)

    setTimeout(() => {
      this.$el.classList.add('is-visible')
    }, 10)

    this.$inputs = this.$el.querySelectorAll('input')
    this.getConfig()

    return this.$el
  }
}
