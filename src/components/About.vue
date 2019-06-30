<template>
  <div class="About" @click="onClickOutside"> 
    <div class="About__backdrop"></div>
    <div class="About__inner" @click="onClickAbout">
      <div class="About__title">About</div>
      <div class="About__content">
        <div class="About__description">
          
          <p>"Map with Me" is a collaborative mapping tool that lets anyone with a Twitter account to add interesting places in your map.</p>

          <p>You can follow the development of the tool, suggest improvements, and report bugs in its <a href="https://github.com/javierarce/map-with-me">GitHub repo</a>.</p>

          <div class="About__columns">
            <div>
              <div class="About__columnTitle">Do you want to map with others? </div>
              <p><a href="https://glitch.com/edit/#!/remix/mapwithme">Remix this project on
                  Glitch</a> and follow the instructions you'll find in the README.md file.</p>
            </div>

            <div>
              <div class="About__columnTitle">Copyright</div>
              <p>This website uses data from <a href="https://www.openstreetmap.org/copyright">Nominatim</a>. If you remix it, please read its <a href="https://operations.osmfoundation.org/policies/nominatim/">usage policy</a>.</p>
            </div>
          </div>

        </div>
        <div class="About__footer">
          <div class="About__export">
            <a href="/rss" title="RSS">RSS</a> &middot; <a href="/csv" title="Export locations in CSV format">Download locations</a> (.CSV)
          </div>
          <div class="About__copyright">Made by <a href="https://twitter.com/javier">Javier Arce</a></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '../../config'

export default {
  methods: {
    onClickOutside () {
      window.bus.$emit(config.ACTIONS.TOGGLE_ABOUT)
    },
    onClickAbout (e) {
      if (e.target && e.target.tagName !== 'A') {
        e.stopPropagation()
        e.preventDefault()
      }
    }
  }
}
</script>

