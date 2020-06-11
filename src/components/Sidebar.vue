<template>
  <div class="Sidebar">
    <div class="Sidebar__content">
      <Locations :height="height" />
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
      this.height = documentHeight - MARGIN_BOTTOM
    }
  }
}
</script>

