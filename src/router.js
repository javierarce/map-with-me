var Vue = require('vue')
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Home from './components/Home.vue'

let routes = [
  { path: '/', component: Home, name: 'Home' }
]

export const router = new VueRouter({
  mode: 'history',
  routes: routes
})
