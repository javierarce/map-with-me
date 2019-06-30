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

const MARGIN_BOTTOM = 20

export default {
  components: {
    Locations
  }, 
  data () {
    return {
      height: undefined
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getHeight()
    })
  },
  methods: {
    getHeight () {
      let documentHeight = this.$el.getBoundingClientRect().height
      let footerHeight = this.$refs.footer.getBoundingClientRect().height 

      this.height = documentHeight - (footerHeight + MARGIN_BOTTOM)
    }
  }
}
</script>

