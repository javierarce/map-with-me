<template>
  <div class="Config" @click="onClickOutside"> 

    <div class="Config__backdrop"></div>

    <div class="Config__content" @click="onClickInside">
        <div class="Config__spinner Spinner is-small" v-if="isSaving"></div>

      <div class="Config__form">
        <h3 class="Config__sectionTitle">Configure your map</h3>
        <p class="Config__sectionDescription">Change this configuration to center the map.</p>
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

          <label for="zoom">
            <strong class="Input__label">Zoom level</strong>
            <div class="Input__field Config__field is-small">
              <input id="zoom" type="text" class="Input" placeholder="Zoom" v-model="zoom">
            </div>
          </label>

        </div>

        <div class="Config__footer">
          <div class="Config__sectionContent">
            <div class="Input__field Config__field">
              <input type="text" class="Input" placeholder="Secret" v-model="secret">
            </div>
            <button class="Button is-bold" @click="onClickSaveConfig" :class="saveButtonClass">Save configuration</button>
          </div>
        </div>
      </div>
    </div>

    <div class="Config__content is-dangerous" @click="onClickInside">
      <div class="Config__spinner Spinner is-small" v-if="isDestroying"></div>
      <div class="Config__footer">
        <h3 class="Config__sectionTitle">Destroy DB</h3>
        <p class="Config__sectionDescription">Enter your secret to destroy the database. This action cannot be undone.</p>
        <div class="Config__sectionContent">
          <div class="Input__field Config__field">
            <input type="text" class="Input" placeholder="Secret" v-model="secretDestroy">
          </div>

          <button class="Button is-bold is-destructive" @click="onClickDestroy" :class="destroyButtonClass">Destroy DB</button>
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
  watch: {
    secretDestroy (val) {
      if (val) {
        this.destroyButtonIsEnabled = true
      } else {
        this.destroyButtonIsEnabled = false
      }
    },
    secret (val) {
      if (val) {
        this.sendButtonIsEnabled = true
      } else {
        this.sendButtonIsEnabled = false
      }
    }
  },
  data () {
    return {
      isDestroying: false,
      isSaving: false,
      sendButtonIsEnabled: false,
      destroyButtonIsEnabled: false,
      default_search_location: mapConfig.DEFAULT_SEARCH_LOCATION,
      lat: mapConfig.LAT,
      lon: mapConfig.LON,
      zoom: mapConfig.ZOOM,
      secret: undefined,
      secretDestroy: undefined
    }
  },
  computed: {
    destroyButtonClass () {
      if (!this.destroyButtonIsEnabled) {
        return 'is-disabled'
      }
    },
    saveButtonClass () {
      if (!this.sendButtonIsEnabled) {
        return 'is-disabled'
      }
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
        window.bus.$emit(config.ACTIONS.STOP_LOADING)
        this.isDestroying = false
      })
    },

    onClickDestroy () {
      if (!this.secretDestroy) {
        return
      }

      window.bus.$emit(config.ACTIONS.START_LOADING)
      this.isDestroying = true

      this.post(config.ENDPOINTS.RECREATE_DB, { secret: this.secretDestroy })
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
      window.bus.$emit(config.ACTIONS.STOP_LOADING)
        this.isSaving = false
        console.log(result);
      })
    },

    onClickSaveConfig () {
      if (!this.secret) {
        return
      }

      window.bus.$emit(config.ACTIONS.START_LOADING)
      this.isSaving = true

      this.post(config.ENDPOINTS.CONFIG, { secret: this.secret, lat: this.lat, lon: this.lon, zoom: this.zoom, default_search_location: this.default_search_location })
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
