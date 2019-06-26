<template>
  <div class="Header">
    <div class="Header__info">
      <button class="Button Header__title" @click="onClickTitle" v-html="title"></button>
      <Search />
    </div>
    <div class="Header__links">
      <button class="Button Header__linksItem" @click="onClickAbout">About</button>
      <button class="Button Header__linksItem with-image" @click="onClickLogin" v-if="loggedIn">
        <div class="Header__linksItemAvatar"><img :src="avatarURL" /></div>
      </button>
      <button class="Button Header__linksItem" @click="onClickLogin" v-else>Log in</button>
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
      window.bus.$on(config.ACTIONS.LOGGED_IN, this.onLoggedIn, this)
    },
    onClickTitle () {
      window.bus.$emit(config.ACTIONS.SHOW_DEFAULT_POINT)
    },
    onClickAbout () {
      let title =  config.TEXTS.ABOUT_TITLE
      let description = config.TEXTS.ABOUT_DESCRIPTION
      let extra = config.TEXTS.ABOUT_EXTRA
      window.bus.$emit(config.ACTIONS.TOGGLE_ABOUT, title, description, extra)
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
