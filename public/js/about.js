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
          <p><strong>Map with Me</strong> is a collaborative mapping tool for
          you and your friends. Follow the development of the tool, suggest
          improvements, and report bugs in <a href="https://github.com/javierarce/map-with-me" target="_blank" title="Visit the repo in GitHub">in GitHub</a>.</p>
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
