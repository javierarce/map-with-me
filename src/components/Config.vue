<template>
  <div class="Config">
    <div class="Config__content">

      <h3 class="Config__sectionTitle">Configuration</h3>

      <div class="Input__field Config__field">
        <input type="text" class="Input" placeholder="Longitude" v-model="lon">
      </div>

      <div class="Input__field Config__field">
        <input type="text" class="Input" placeholder="Latitude" v-model="lat">
      </div>

      <div class="Input__field Config__field">
        <input type="text" class="Input" placeholder="Zoom" v-model="zoom">
      </div>

      <div class="Input__field Config__field">
        <input type="text" class="Input" placeholder="Default location" v-model="default_search_location">
      </div>

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
