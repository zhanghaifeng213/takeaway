// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'
import router from './router'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import http from '@/libs/httpRequest'

import store from './store'
import VueSocketIO from 'vue-socket.io'
import VueClipboard from 'vue-clipboard2' // 复制

// 图片预览
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Vue.use(Viewer)

Vue.use(VueClipboard)
Vue.use(new VueSocketIO({
  debug: true,
  connection: process.env.SOCKETIO,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))

Vue.use(Element)

Vue.http = Vue.prototype.$http = http
Vue.config.productionTip = false
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    // in the free login whitelist, go directly
    next()
  }
  if (to.meta.requireAuth) {
    const token = sessionStorage.getItem('token')
    if (token) {
      if (store.state.status == 'success') {
        next()
      } else {
        store.dispatch('handleUserInfo').then((res) => {
          next()
        }).catch(err => {
          next('/login')
        })
      }
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
