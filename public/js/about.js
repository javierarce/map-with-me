class About {
  constructor () {
    this.isVisible = false
  }

  template () {
    return `
    <div class="About__backdrop"></div>
    <div class="About__inner has-transition js-inner">
      <div class="About__title">About</div>
      <div class="About__content">
        <div class="About__description">

          <p><strong>Map with Me</strong> is a collaborative mapping tool for you and your friends.</p>


          <div class="About__columns">
            <div>
              <div class="About__columnTitle">Create your own map</div>
              <p>Remix this project in Glitch and follow the instructions you'll find in the README.md file.</p>
          <a href="https://glitch.com/edit/#!/remix/mapwithme" class="Button About__button is-bold" title="Remix this project in Glitch" target="_blank">Remix the project</a>
            </div>

            <div>
              <div class="About__columnTitle">Improve the tool</div>
          <p>Follow the development of the tool, suggest improvements, and
            report bugs in GitHub.</p>
          <a href="https://github.com/javierarce/map-with-me" class="Button About__button is-bold" title="Visit the repo in GitHub" target="_blank">Visit the repo</a>
            </div>
            <div>
              <div class="About__columnTitle">Export the data</div>
              <p>
                Get the data in a GeoJSON or a <a href="/csv" target="_blank">CSV file</a>. You can also subscribe to this map via <a href="/rss" title="RSS" target="_blank">RSS</a>.
              </p>
              <a href="/geojson" title="Export locations in GeoJSON format" target="_blank"class="Button About__button is-bold">Get the data</a>

            </div>
          </div>

        </div>
        <div class="About__footer">
          <div class="About__export">
              <p>This website uses data from <a href="https://www.openstreetmap.org/copyright">Nominatim</a>. If you remix it, please read its <a href="https://operations.osmfoundation.org/policies/nominatim/">usage policy</a>.</p>
          </div>
          <div class="About__copyright">Made by <a href="https://twitter.com/javier">Javier Arce</a></div>
        </div>
      </div>
    </div>
    `
  }

  hide () {
    this.isVisible = false
    this.$el.classList.remove('is-visible')
  }

  toggle () {
    this.isVisible != this.isVisible
    this.$el.classList.toggle(this.isVisible ? undefined : 'is-visible')
  }

  onClickOutside () {
    window.bus.emit(config.ACTIONS.TOGGLE_ABOUT)
  }

  onClickInside (e) {
    if (e.target && e.target.tagName !== 'A') {
      killEvent(e)
    }
  }

  render () {
    this.$el = createElement({ className: 'About'})
    let html = ejs.render(this.template())

    this.$el.insertAdjacentHTML('beforeend', html)
    this.$el.onclick = this.onClickOutside.bind(this)

    this.$inner = this.$el.querySelector('.js-inner')
    this.$inner.onclick = this.onClickInside.bind(this)

    return this.$el
  }
}

