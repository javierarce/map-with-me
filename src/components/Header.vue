<template>
  <div class="Header">
    <div class="Header__info">
      <button class="Button Header__title" @click="onClickTitle" v-html="title"></button>
      <Search />
    </div>
    <div class="Header__links">
      <button class="Button Header__linksItem" @click="onClickAbout">About</button>

      <div v-if="showLogin">
        <button class="Button Header__linksItem with-image" @click="onClickLogin" v-if="loggedIn">
          <div class="Header__linksItemAvatar"><img :src="avatarURL" /></div>
        </button>
        <button class="Button Header__linksItem" @click="onClickLogin" v-else>Log in</button>
      </div>
    </div>
  </div>
</template>

<script>
import Search from './Search.vue'
import config from '../../config'
import mixins from '../mixins'

export default {
  mixins: [mixins],
  components: {
    Search
  },
  data() {
    return {
      title: config.TEXTS.MAIN_TITLE,
      showLogin: config.ADMIN.LOGIN_REQUIRED,
      loggedIn: false,
      username: undefined,
      avatarURL: undefined
    }
  },
  mounted () {
    this.bindEvents()
  },
  methods: {
    bindEvents () {
      window.bus.$off(config.ACTIONS.LOGGED_IN)

      window.bus.$on(config.ACTIONS.LOGGED_IN, this.onLoggedIn, this)
    },
    onClickTitle () {
      window.bus.$emit(config.ACTIONS.SHOW_DEFAULT_POINT)
    },
    onClickAbout () {
      window.bus.$emit(config.ACTIONS.TOGGLE_ABOUT)
    },
    onClickLogin () {
      if (window.bus.isLoggedIn()) {
        console.log('logout') // TODO
      } else {
        window.location.href = config.ENDPOINTS.LOGIN_PATH
      }
    },
    onLoggedIn () {
      this.loggedIn = window.bus.isLoggedIn()

      if (this.loggedIn) {
        this.avatarURL = window.bus.user.profileImage
        this.username = `@${window.bus.user.username}`
      }
    }
  }
}
</script>
