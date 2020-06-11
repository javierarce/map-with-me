<template>
  <div class="Locations">
    <div class="Locations__inner" v-if="markers.length">
      <button :data-id="marker.options.location.id" class="Locations__item" :class="itemClass(marker)" v-for="marker in markers" @click="onClickMarker(marker)" :key="marker.options.location.id">
        <div class="Locations__itemName" v-html="marker.options.location.name"></div>
        <div class="Locations__itemDescription" v-html="marker.options.location.description"></div>
        <div class="Locations__itemAddress" v-html="marker.options.location.address"></div>
        <div class="Locations__itemFooter" v-if="showFooter(marker)">
          <div class="Locations__itemUser" v-html="username(marker)"></div>
          <div class="Locations__itemFooterOptions">
            <button class="Locations__itemApprove" @click="onClickToggleApprove($event, marker)" v-if="showApproveItem(marker)" v-html="getApproveLabel(marker)"></button>
            <button class="Locations__itemRemove" @click="onClickRemove($event, marker)" v-if="showRemoveItem(marker)">delete</button>
          </div>
        </div>
      </button>
    </div>
    <div class="Locations__none" v-else>Click on the map to add the first location.</div>
  </div>
</template>

<script>
import mixins from '../mixins'

import config from '../../config'
import mapConfig from '../../map.yaml'

export default {
  props: ['height'],
  mixins: [mixins],
  data () {
    return {
      activeMarker: undefined,
      markers: window.bus.markers
    }
  },
  watch: {
    height (value) {
      this.$el.style.height = `${value}px`
      return value
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.bindEvents()
    })
  },
  methods: {
    bindEvents () {
      window.bus.$off(config.ACTIONS.ADD_MARKER)
      window.bus.$off(config.ACTIONS.SELECT_MARKER)

      window.bus.$on(config.ACTIONS.ADD_MARKER, this.onAddMarker)
      window.bus.$on(config.ACTIONS.SELECT_MARKER, this.onSelectMarker)
    },
    onClickToggleApprove (e, marker) {
      e.preventDefault()
      e.stopPropagation()

      let id = marker.options.location.id

      let url = marker.options.location.approved ? config.ENDPOINTS.REJECT : config.ENDPOINTS.APPROVE

      this.post(url, { id })
        .then(this.onToggleApprove.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    onClickRemove (e, marker) {
      e.preventDefault()
      e.stopPropagation()

      let confirmation = confirm('Are you sure you want to delete this location?')

      if (confirmation) {
        let location = marker.options.location

        this.post(config.ENDPOINTS.REMOVE, { location })
          .then(this.onRemoveLocation.bind(this))
          .catch((error) => {
            console.log(error)
          })
      }
    },
    onToggleApprove (response) {
      response.json().then((result) => {
        if (result) {
          let marker = this.markers.find(marker => marker.options.location.id === result.id)
          marker.options.location.approved = result.approved

          if (result.approved) {
            marker.getElement().classList.remove('is-disabled')
          } else {
            marker.getElement().classList.add('is-disabled')
          }
        }
      })
    },
    onRemoveLocation (response) {
      response.json().then((result) => {
        if (result && !result.error) {
          let $item = this.getItemById(result.id) 
          $item.classList.add('is-hidden')

          this.removeMarker(result.id)

          setTimeout(() => {
            $item.remove()
          }, 500)
        }
      })
    },
    onClickMarker (marker) {
      if (this.isMarkerActive(marker)) {
        return
      }

      this.activateMarker(marker)
      window.bus.$emit(config.ACTIONS.VISIT_MARKER, marker)
    },
    onSelectMarker (marker) {
      this.activateMarker(marker)

      let $item = this.getItemById(marker.options.location.id) 
      $item.scrollIntoView({ behavior: 'smooth' })
    },
    onAddMarker (marker) {
      this.activateMarker(marker)
      this.markers.unshift(marker)
    },
    isMyMarker (marker) {
      return marker.options.location.user ? (marker.options.location.user.username === window.bus.user.username) : false
    },
    removeMarker (id) {
      window.bus.$emit(config.ACTIONS.REMOVE_MARKER, id)
    },
    showFooter (marker) {
      return this.showApproveItem(marker) || (marker.options && marker.options.location && marker.options.location.user)
    },
    showApproveItem (marker) {
      return window.bus.isModerated() && (window.bus.isLoggedIn() && window.bus.user.username === window.bus.getAdminUsername() && !this.isMyMarker(marker))
    },
    showRemoveItem (marker) {
      return window.bus.isLoggedIn() && (this.isMyMarker(marker) || window.bus.isAdmin())
    },
    getApproveLabel (marker) {
      return marker.options.location.approved ? 'reject' : 'approve'
    },
    getItemById (id) {
      return this.$el.querySelector(`[data-id='${id}']`)
    },
    username (marker) {
      return marker.options.location.user ? `@${marker.options.location.user.username}` : 'Anonymous'
    },
    itemClass (marker) {
      let classes = []

      if (this.isMarkerActive(marker)) {
        classes.push('is-active')
      }

      if (window.bus.isAdmin() && this.isMarkerRejected(marker)) {
        classes.push('is-rejected')
      }

      return classes.join(' ')
    },
    isMarkerRejected (marker) {
      return !marker.options.location.approved
    },
    isMarkerActive (marker) {
      return marker === this.activeMarker
    },
    activateMarker (marker) {
      this.activeMarker = marker
    }
  }
}
</script>
