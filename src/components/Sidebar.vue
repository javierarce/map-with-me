<template>
  <div class="Sidebar">
    <div class="Sidebar__content">
      <Locations :height="height" />
    </div>
    <div class="Sidebar__footer" ref="footer">
      This website uses data from <a href="https://www.openstreetmap.org/copyright">Nominatim</a> ✨
    </div>
  </div>
</template>

<script>
import Locations from './Locations.vue'
import config from '../../config'

export default {
  components: {
    Locations
  }, 
  data () {
    return {
      description: config.TEXTS.DESCRIPTION,
      height: undefined
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getHeight()
    })
  },
  methods: {
    onClickLearn () {
      let title =  config.TEXTS.ABOUT_TITLE
      let description = config.TEXTS.ABOUT_DESCRIPTION
      window.bus.$emit(config.ACTIONS.TOGGLE_ABOUT, title, description)
    },
    getHeight () {
      let documentHeight = this.$el.getBoundingClientRect().height
      let footerHeight = this.$refs.footer.getBoundingClientRect().height 
      let descriptionHeight = 0
      let marginBottom = 20
      //let descriptionHeight = this.$refs.description.getBoundingClientRect().height

      this.height = documentHeight - (footerHeight + descriptionHeight + marginBottom)
    }
  }
}
</script>

