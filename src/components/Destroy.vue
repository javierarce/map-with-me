<template>
  <div class="Config" @click="onClickOutside"> 

    <div class="Config__backdrop"></div>

    <div class="Config__inner has-transition">
      <div class="Config__content" @click="onClickInside">
        <div class="Config__spinner Spinner is-small" v-if="isDestroying"></div>
        <div class="Config__buttons">
          <h3 class="Config__sectionTitle">Destroy DB</h3>
          <p class="Config__sectionDescription">Enter your secret to destroy the database. This action cannot be undone.</p>
          <div class="Config__sectionContent">
            <div class="Input__field Config__field">
              <input type="text" class="Input" placeholder="Secret" v-model="secret">
            </div>

            <button class="Button is-bold is-destructive" @click="onClickDestroy" :class="destroyButtonClass">Destroy DB</button>
          </div>
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
        this.destroyButtonIsEnabled = true
      } else {
        this.destroyButtonIsEnabled = false
      }
    }
  },
  data () {
    return {
      isDestroying: false,
      destroyButtonIsEnabled: false,
      secret: undefined
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
  methods: {
    onClickOutside () {
      window.bus.$emit(config.ACTIONS.TOGGLE_DESTROY)
    },

    onClickInside (e) {
      if (e.target && e.target.tagName !== 'A') {
        e.stopPropagation()
      }
    },

    onRecreateDB (response) {
      response.json().then((result) => {
        window.bus.$emit(config.ACTIONS.STOP_LOADING)
        this.isDestroying = false

        window.bus.$emit(config.ACTIONS.TOGGLE_DESTROY)
        this.$router.go()
      })
    },

    onClickDestroy () {
      if (!this.secret) {
        return
      }

      window.bus.$emit(config.ACTIONS.START_LOADING)
      this.isDestroying = true

      this.post(config.ENDPOINTS.RECREATE_DB, { secret: this.secret })
        .then(this.onRecreateDB.bind(this))
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
