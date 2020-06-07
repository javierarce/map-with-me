<template>
  <div class="Search">
    <div class="Search__content">
      <input type="text" class="Search__input" :placeholder="placeholder" ref="search" v-on:keyup="onKeyUp" v-on:keyup.enter="onSubmit" />
      <div class="Spinner Search__spinner"></div>
    </div>
  </div>
</template>

<script>

import mixins from '../mixins'
import config from '../../config'
import mapConfig from '../../map.yaml'

export default {
  mixins: [mixins],
  data () {
    return {
      placeholder: config.TEXTS.SEARCH_PLACEHOLDER,
      q: undefined
    }
  },
  mounted () {
    this.$nextTick(() => {
      config.MAP = mapConfig.map
    })
  },
  methods: {
    onKeyUp (e) {
      this.q = this.$refs.search.value
    },
    onSubmit (e) {
      e.preventDefault()
      e.stopPropagation()

      this.search()
    },
    search () {
      if (!this.q) {
        return
      }

      let extraParams = '&polygon_geojson=1&format=json&addressdetails=1&namedetails=1&extratags=1'
      let url = `${config.ENDPOINTS.NOMINATIM}${config.ENDPOINTS.SEARCH_URL}?q=${this.q}, ${config.MAP.DEFAULT_SEARCH_LOCATION}${extraParams}`
      this.$el.classList.add('is-searching')
      window.bus.$emit(config.ACTIONS.START_LOADING)

      this.get(url)
        .then(this.onGetResult)
        .catch((error) => {
          console.log(error)
        })
    },
    onGetResult (response) {
      response.json().then((results) => {
        console.log(this.q, results);
          this.$el.classList.remove('is-searching')
          window.bus.$emit(config.ACTIONS.STOP_LOADING)

        if (results.length) {
          window.bus.$emit(config.ACTIONS.SET_VIEW, results[0])
        } else {
          let title = config.TEXTS.NO_RESULTS_TITLE.replace('{q}', this.q)
          let description = config.TEXTS.NO_RESULTS_DESCRIPTION
          let footer = `<a class="Button Alert__button" href="https://www.openstreetmap.org/search?query=${this.q}#map=${config.MAP.ZOOM}/${config.MAP.LAT}/${config.MAP.LON}" target="__blank">Add this place in OSM</a>`

          window.bus.$emit(config.ACTIONS.TOGGLE_ALERT, title, description, footer)
        }
      })
    }
  }
}
</script>

