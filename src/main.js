"use strict";

import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router'

const Home = require('./components/Home.vue').default
const Destroy = require('./components/Destroy.vue').default
const App = require('./app.vue').default

import config from '../config'
import mapConfig from '../map.yaml'

config.ADMIN = mapConfig.admin
config.MAP = mapConfig.map

import styles from './assets/scss/style.scss'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home, name: 'Home' },
    { path: '/admin/:secret', component: Home, name: 'Admin' },
    { path: '/config', component: Destroy, name: 'Destroy' }
  ]
})

window.bus = new Vue({
  data () {
    return {
      markers: [],
      user: undefined
    }
  },
  methods: {
    isLoggedIn () {
      return !!(this.user && this.user.username)
    },
    isAdmin () {
      return !!(this.user && this.user.username && config.ADMIN.ADMIN_USERNAME === this.user.username)
    },
    getTitle () {
      return config.ADMIN.TITLE
    },
    getAdminUsername () {
      return config.ADMIN.ADMIN_USERNAME
    },
    isModerated () {
      return config.ADMIN.MODERATED
    },
    isAnonymous () {
      return config.ADMIN.ANONYMOUS
    },
    isProtected () {
      return config.ADMIN.PROTECTED
    }
  }
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
