/* eslint-disable no-unused-vars */
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import EventDetailedPage from '../views/EventDetailedPage.vue'
import Admin from '../views/AdminPage.vue'
import MyPage from '../views/MyPage.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/event/:id',
    name: 'Event',
    component: EventDetailedPage
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
  },
  {
    path: '/my-page',
    name: 'MyPage',
    component: MyPage
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    window.scrollTo(0, 0);
  }
})

export default router
