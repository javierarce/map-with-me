class About extends Modal {
  constructor () {
    super()
  }

  template () {
    return `
    <div class="Modal__backdrop js-backdrop"></div>
    <div class="About__inner has-transition js-inner">
      <div class="About__title">About</div>
      <div class="About__content">
        <div class="About__description">

          <p><strong>Map with Me</strong> is a collaborative mapping tool for you and your friends.</p>


          <div class="About__columns">
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
              <p>This website uses data from <a href="https://www.openstreetmap.org/copyright">Nominatim</a></p>
          </div>
          <div class="About__copyright">Made by <a href="https://twitter.com/javier">Javier Arce</a> from a mysterious location</div>
        </div>
      </div>
    </div>
    `
  }
}
