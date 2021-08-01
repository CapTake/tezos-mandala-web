import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Collection from '@/views/Collection.vue'
import V1Collection from '@/views/V1Collection.vue'
import config from '../config'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/v1',
    name: 'v1',
    props: { title: 'Migration', byUser: true, key: 1, kt: config.v1 },
    component: V1Collection
  },
  {
    path: '/my-collection',
    name: 'MyCollection',
    props: { title: 'My collection', byUser: true, key: 3, kt: config.contract },
    component: Collection
  },
  {
    path: '/explore',
    name: 'Explore',
    props: { title: 'Explore', byUser: false, key: 2, kt: config.contract },
    component: Collection
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
