<template>
  <div class="Config" @click="onClickOutside"> 

    <div class="Config__backdrop"></div>

    <div class="Config__inner has-transition" @click="onClickInside">
      <div class="Config__content no-bottom-padding">
        <div class="Config__spinner Spinner is-small" v-if="isSaving"></div>

        <div class="Config__form">
          <h3 class="Config__sectionTitle">Configure your map</h3>

          <label for="title">
            <strong class="Input__label">Title</strong>
            <div class="Input__field Config__field">
              <input id="title" type="text" class="Input" placeholder="Title" v-model="title">
            </div>
          </label>
          <div class="Config__section">
            <div class="Config__sectionContent">

              <label for="default_search_location">
                <strong class="Input__label">Search location</strong>
                <div class="Input__field Config__field">
                  <input id="default_search_location" type="text" class="Input" placeholder="Default location" v-model="default_search_location">
                </div>
              </label>

              <label for="lon">
                <strong class="Input__label">Longitude</strong>
                <div class="Input__field Config__field is-small">
                  <input id="lon" type="text" class="Input" placeholder="Longitude" v-model="lon">
                </div>
              </label>

              <label for="lat">
                <strong class="Input__label">Latitude</strong>
                <div class="Input__field Config__field is-small">
                  <input id="lat" type="text" class="Input" placeholder="Latitude" v-model="lat">
                </div>
              </label>

              <label for="zoom">
                <strong class="Input__label">Zoom level</strong>
                <div class="Input__field Config__field is-small is-small">
                  <input id="zoom" type="text" class="Input" placeholder="Zoom" v-model="zoom">
                </div>
              </label>

            </div>
          </div>

          <label for="admin">
            <strong class="Input__label">Admin username</strong>
            <div class="Input__field Config__field is-medium">
              <input id="admin" type="text" class="Input" placeholder="Admin" v-model="admin">
            </div>
          </label>

          <div class="Config__section">
            <strong class="Input__label">Publication settings</strong>

            <div class="Config__sectionContent">
              <label for="anonymous">

                <div class="Input__field Input__checkbox Config__field">
                  <input id="anonymous" type="checkbox" v-model="anonymous"> 
                  <p>
                    <strong class="Input__title">Anonymous</strong> 
                    <div class="Tooltip">?<span class="Tooltip__text">Login is not required</span></div>
                  </p>
                </div>
              </label>

              <label for="moderated">
                <div class="Input__field Input__checkbox Config__field">
                  <input id="moderated" type="checkbox" v-model="moderated"> <p>
                      <strong class="Input__title">Moderated</strong> 
                    <div class="Tooltip">?  <span class="Tooltip__text">Submissions require approval</span></div>
                  </p>
                </div>
              </label>

              <label for="protected">
                <div class="Input__field Input__checkbox Config__field">
                  <input id="protected" type="checkbox" v-model="protected"> 
                  <p><strong class="Input__title">Protected</strong> 
                    <div class="Tooltip">?<span class="Tooltip__text"> Map is read-only</span></div>
                  </p>
                </div>
              </label>
            </div>
            <transition name="fade">
            <div class="Config__hint" v-if="showModerationHint">Visit {{currentURL}}admin/SECRET to manage the submissions.</div>
            </transition>
          </div>

          <div class="Config__buttons">
            <div class="Config__sectionContent">
              <div class="Input__field Config__field">
                <input type="text" class="Input" placeholder="Secret" v-model="secret">
              </div>
              <button class="Button is-bold" @click="onClickSaveConfig" :class="saveButtonClass">Save configuration</button>
            </div>
          </div>
        </div>

        <div class="Config__footer">
          <div>After changing this configuration, please restart the server.</div> 
        </div>
      </div>
      <div class="Config__dangerZone">
        <div class="Config__dangerZoneContent">
          Do you want to start again? <button class="Button is-link" @click="onClickDestroy">Destroy the database</button>
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
      isSaving: false,
      currentURL: window.location.href,
      sendButtonIsEnabled: false,
      default_search_location: mapConfig.map.DEFAULT_SEARCH_LOCATION,
      title: mapConfig.admin.TITLE,
      lat: mapConfig.map.LAT,
      lon: mapConfig.map.LON,
      zoom: mapConfig.map.ZOOM,
      anonymous: mapConfig.admin.ANONYMOUS,
      moderated: mapConfig.admin.MODERATED,
      protected: mapConfig.admin.PROTECTED,
      admin: mapConfig.admin.ADMIN_USERNAME,
      secret: undefined,
    }
  },
  computed: {
    showModerationHint () {
      return this.moderated && this.anonymous
    },
    saveButtonClass () {
      if (!this.sendButtonIsEnabled) {
        return 'is-disabled'
      }
    }
  },
  methods: {
    onClickDestroy (e) {
      window.bus.$emit(config.ACTIONS.TOGGLE_CONFIG)
      window.bus.$emit(config.ACTIONS.TOGGLE_DESTROY)
    },
    onClickOutside () {
      window.bus.$emit(config.ACTIONS.TOGGLE_CONFIG)
    },

    onClickInside (e) {
      if (e.target && e.target.tagName !== 'A') {
        e.stopPropagation()
      }
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
      })
    },

    onClickSaveConfig () {
      if (!this.secret) {
        return
      }

      window.bus.$emit(config.ACTIONS.START_LOADING)

      this.isSaving = true

      let configuration = {
        secret: this.secret,
        admin: {
          title: this.title,
          moderated: this.moderated,
          anonymous: this.anonymous,
          protected: this.protected,
          admin_username: this.admin
        },
        map: {
          lat: this.lat, lon: this.lon, zoom: this.zoom, default_search_location: this.default_search_location 
        }
      }

      this.post(config.ENDPOINTS.CONFIG, configuration )
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
