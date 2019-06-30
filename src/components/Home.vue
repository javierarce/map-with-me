<template>
  <div class="App">
    <transition name="slide-fade">
    <Alert v-if="showAlert" :title="alertTitle" :description="alertDescription" :footer="alertFooter" />
    <About v-if="showAbout" />
    </transition>
    <Header />
    <Map />
    <Sidebar />
  </div>
</template>

<script>
import mixins from '../mixins'
import config from '../../config'

import Sidebar from './Sidebar.vue'
import About from './About.vue'
import Alert from './Alert.vue'
import Header from './Header.vue'
import Map from './Map.vue'

export default {
  mixins: [mixins],
  components: {
    About,
    Alert,
    Header,
    Map,
    Sidebar
  },
  data () {
    return {
      alertDescription: undefined,
      alertFooter: undefined,
      alertTitle: undefined,
      locations: [],
      showAbout: false,
      showAlert: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.bindEvents()
      this.getStatus()
    })
  },
  methods: {
    bindEvents () {
      window.bus.$off(config.ACTIONS.ADD_LOCATION)
      window.bus.$off(config.ACTIONS.LOGIN)
      window.bus.$off(config.ACTIONS.ON_LOAD)
      window.bus.$off(config.ACTIONS.START_LOADING)
      window.bus.$off(config.ACTIONS.STOP_LOADING)
      window.bus.$off(config.ACTIONS.TOGGLE_ABOUT)
      window.bus.$off(config.ACTIONS.TOGGLE_ALERT)
      window.bus.$off(config.ACTIONS.TOGGLE_MAP_SIZE)

      window.bus.$on(config.ACTIONS.ADD_LOCATION, this.onAddLocation)
      window.bus.$on(config.ACTIONS.LOGIN, this.onLogin)
      window.bus.$on(config.ACTIONS.ON_LOAD, this.onLoad)
      window.bus.$on(config.ACTIONS.START_LOADING, this.onStartLoading)
      window.bus.$on(config.ACTIONS.STOP_LOADING, this.onStopLoading)
      window.bus.$on(config.ACTIONS.TOGGLE_ABOUT, this.onToggleAbout)
      window.bus.$on(config.ACTIONS.TOGGLE_ALERT, this.onToggleAlert)
      window.bus.$on(config.ACTIONS.TOGGLE_MAP_SIZE, this.onToggleMapSize)

      document.onkeyup = this.onKeyUp
    },
    onKeyUp (e) {
      e.preventDefault()
      e.stopPropagation()

      if (e.keyCode === 27) {
        this.showAlert = false
        this.showAbout = false
      }
    },
    onLoad () {
      document.body.classList.add('is-loaded')
    },
    onGetStatus (response) {
      response.json().then((result) => {
        if (!result && !result.user) {
          return
        }

        if (config.ADMIN.LOGIN_REQUIRED) {
          window.bus.user = result.user
        }

        window.bus.$emit(config.ACTIONS.LOGGED_IN)

        if (result.coordinates) {
          window.bus.$emit(config.ACTIONS.SHOW_SAVED_LOCATION, result.coordinates)
        }

        this.getLocations()

      }).catch((error) => {
        console.log(error)
      })
    },
    onGetAddedLocation (response) {
      response.json().then((result) => {
        window.bus.$emit(config.ACTIONS.SHOW_ADDED_LOCATION, result)
      })
    },
    onGetLocations (response) {
      response.json().then((result) => {
        window.bus.$emit(config.ACTIONS.ADD_LOCATIONS, result.locations)
      })
    },
    getStatus () {
      this.get(config.ENDPOINTS.STATUS)
        .then(this.onGetStatus.bind(this))
        .catch((error) => {
          console.log('Error', error)
        })
    },
    onStartLoading () {
      document.body.classList.add('is-loading')
    },
    onStopLoading () {
      document.body.classList.remove('is-loading')
    },
    onToggleAbout () {
      this.showAbout = !this.showAbout
    },
    onToggleAlert (title, description, footer) {
      this.showAlert = !this.showAlert
      this.alertTitle = title
      this.alertDescription = description
      this.alertFooter = footer
    },
    onToggleMapSize (value) {
      document.body.classList[value ? 'add' : 'remove']('is-expanded')
    },
    onAddLocation ({ coordinates, name, description, address }) {
      this.post(config.ENDPOINTS.ADD, { coordinates, name, description, address })
        .then(this.onGetAddedLocation.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    getLocations () {
      this.get(config.ENDPOINTS.LOCATIONS)
        .then(this.onGetLocations.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    onLogin ({ coordinates, zoom, name, description, address }) {
      this.post(config.ENDPOINTS.SAVE, { coordinates, zoom, name, description, address }).then((response) => {
        window.location.href = config.ENDPOINTS.LOGIN_PATH
      })
    }
  }
}
</script>
