<template>
  <div class="About" @click="onClickOutside"> 
    <div class="About__backdrop"></div>
    <div class="About__inner" @click="onClickAbout">
      <div class="About__title">About</div>
      <div class="About__content">
        <div class="About__description"><p>"Map with Me" is a collaborative
          mapping tool that lets anyone with a Twitter account to add interesting places in your map.</p>

          <p>Do you want to map with others? <a href="https://glitch.com/edit/#!/remix/mapwithme">Remix this project on
              Glitch</a> and follow the instructions you'll find in the <code>README.md</code> file.</p>

          <p>This website uses data from <a href="https://www.openstreetmap.org/copyright">Nominatim</a>. If you remix this code, please make sure you read its <a href="https://operations.osmfoundation.org/policies/nominatim/">usage policy</a>.</p>

        </div>
        <div class="About__footer">If you need help setting up your map, contact me at Twitter → <a href="https://twitter.com/javier">@javier</a></div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '../../config'

export default {
  data () {
    return {
      description: undefined,
      extra: undefined,
      title: undefined
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.title = config.TEXTS.ABOUT_TITLE
      this.description = config.TEXTS.ABOUT_DESCRIPTION
      this.extra = config.TEXTS.ABOUT_EXTRA
    })
  },
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

