import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'animate.css';
import Notifications from 'vue-notification'
import VTooltip from 'v-tooltip'

Vue.config.productionTip = false

window.EventBus = new Vue();

Vue.use(Notifications)
Vue.use(VTooltip)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
