"use strict";

import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router'

const Home = require('./components/Home.vue').default
const Config = require('./components/Config.vue').default
const App = require('./app.vue').default

import config from '../config'
import mapConfig from '../map.yaml'

config.ADMIN = mapConfig.admin

import styles from './assets/scss/style.scss'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home, name: 'Home' },
    { path: '/config', component: Config, name: 'Config' }
  ]
})

window.bus = new Vue({
  data () {
    return {
      user: undefined
    }
  },
  methods: {
    isLoggedIn () {
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
  render: h => h(App)
})
