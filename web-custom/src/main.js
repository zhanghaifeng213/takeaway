// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import info from 'components/info/info';
import record from 'components/record/record';
import LoginAndReg from 'components/login-and-reg/index';
import layout from 'components/layout/index';
import store from './store'
import 'common/stylus/index.styl';
import http from '@/libs/httpRequest'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'


Vue.use(Vuetify)
Vue.http = Vue.prototype.$http = http
Vue.use(VueRouter);
Vue.use(VueResource);
window.eventBus = new Vue()
var router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    { path: '/', component: LoginAndReg },
    {
      path: '/',
      name: 'main',
      component: layout,
      children: [
        {
          path: '/goods',
          name: 'goods',
          component: goods,
        },
        {
          path: '/ratings',
          name: 'ratings',
          component: ratings,
        },
        {
          path: '/info',
          name: 'info',
          component: info
        },
        {
          path: '/record',
          name: 'record',
          component: record
        }
      ]
    }
  ]
});
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');

