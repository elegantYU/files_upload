import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router/router'
import store from '@/store/store'
import '@/plugins/element.js'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
