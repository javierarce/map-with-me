<template>
  <div class="Alert" @click="onClickOutside"> 
    <div class="Alert__backdrop"></div>
    <div class="Alert__content has-transition" @click="onClickAlert">
      <div class="Alert__title" v-html="title"></div>
      <div class="Alert__description" v-html="description"></div>
      <div class="Alert__footer" v-html="footer" v-if="footer"></div>
    </div>
  </div>
</template>

<script>
import config from '../../config'

export default {
  props: ['title', 'description', 'footer'],
  methods: {
    onClickOutside () {
      window.bus.$emit(config.ACTIONS.TOGGLE_ALERT)
    },
    onClickAlert (e) {
      if (e.target && e.target.tagName !== 'A') {
        e.stopPropagation()
        e.preventDefault()
      }
    }
  }
}
</script>

