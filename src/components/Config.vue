<template>
  <div class="Config" @click="onClickOutside"> 
    <div class="Config__backdrop"></div>
    <div class="Config__content" @click="onClickInside">

      <h3 class="Config__sectionTitle">Configuration</h3>

      <label for="default_search_location">
        <strong class="Input__label">Search location</strong>
        <div class="Input__field Config__field">
          <input id="default_search_location" type="text" class="Input" placeholder="Default location" v-model="default_search_location">
        </div>
      </label>

      <div class="Config__sectionContent">
        <label for="lon">
          <strong class="Input__label">Longitude</strong>
          <div class="Input__field Config__field">
            <input id="lon" type="text" class="Input" placeholder="Longitude" v-model="lon">
          </div>
        </label>

        <label for="lat">
          <strong class="Input__label">Latitude</strong>
          <div class="Input__field Config__field">
            <input id="lat" type="text" class="Input" placeholder="Latitude" v-model="lat">
          </div>
        </label>
      </div>

      <label for="zoom">
        <strong class="Input__label">Zoom level</strong>
        <div class="Input__field Config__field">
          <input id="zoom" type="text" class="Input" placeholder="Zoom" v-model="zoom">
        </div>
      </label>



      <button class="Button is-bold" @click="onClickSaveConfig">Save configuration</button>

      <div class="Config__destroy">
        <h3 class="Config__sectionTitle">Destroy DB</h3>
        <div class="Config__sectionContent">
          <div class="Input__field Config__field">
            <input type="text" class="Input" placeholder="Secret" v-model="secret">
          </div>

          <button class="Button is-bold is-destructive" @click="onClickDestroy">Destroy DB</button>
        </div>
      </div>

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
      default_search_location: mapConfig.DEFAULT_SEARCH_LOCATION,
      lat: mapConfig.LAT,
      lon: mapConfig.LON,
      zoom: mapConfig.ZOOM,
      secret: undefined
    }
  },
  mounted () {
    this.$nextTick(() => {
      // this.getConfig()
    })
  },
  methods: {
    onClickOutside () {
      window.bus.$emit(config.ACTIONS.TOGGLE_CONFIG)
    },

    onClickInside (e) {
      if (e.target && e.target.tagName !== 'A') {
        e.stopPropagation()
        e.preventDefault()
      }
    },

    onRecreateDB (response) {
      response.json().then((result) => {
        alert(result.ok)
      })
    },

    onClickDestroy () {
      if (!this.secret) {
        return
      }

      this.post(config.ENDPOINTS.RECREATE_DB, { secret: this.secret })
        .then(this.onRecreateDB.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    onGetConfig (response) {
      response.json().then((result) => {
        this.default_search_location = result.default_search_location
        this.lat = result.lat
        this.lon = result.lon
        this.zoom = result.zoom
      })
    },

    onSaveConfig (response) {
      response.json().then((result) => {
        console.log(result);
      })
    },

    onClickSaveConfig () {
      this.post(config.ENDPOINTS.CONFIG, { lat: this.lat, lon: this.lon, zoom: this.zoom, default_search_location: this.default_search_location })
        .then(this.onSaveConfig.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },

    getConfig () {
      this.get(config.ENDPOINTS.CONFIG)
        .then(this.onGetConfig.bind(this))
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
