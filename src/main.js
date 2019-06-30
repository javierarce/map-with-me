var Vue = require('vue')
var App = require('./app.vue')

import { router } from './router'
import config from '../config'

window.bus = new Vue({
  data () {
    return {
      user: {
        username: 'anon',
        name: 'anonymous',
        profileImage: ''
      }
    }
  },
  methods: {
    isLoggedIn () {
      if (!config.ADMIN.LOGIN_REQUIRED) {
        return true
      }
      return !!(this.user && this.user.username)
    },
    isAdmin () {
      return !!(this.user && this.user.username && config.ADMIN.ADMIN_USERNAME === this.user.username)
    }
  }
})

new Vue({
  el: '#app',
  router,
  render: function (createElement) {
    return createElement(App)
  }
})
