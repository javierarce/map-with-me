import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = require('./components/Home.vue').default
const Test = require('./components/Test.vue').default

export const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home, name: 'Home' },
    { path: '/test', component: Test, name: 'Test' }
  ]
})
