import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store/store.js'
import VueLazyLoad from 'vue-lazyload'
import VueCookies from 'vue-cookies'
import vuePayKeyboard from 'vue-pay-keyboard'
/* UI库  */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vant from 'vant'
import 'vant/lib/vant-css/index.css';
import './common/scss/icon.css'


Vue.config.productionTip = false
Vue.prototype.$http = axios;


Vue.use(ElementUI)
Vue.use(Vant)
Vue.use(VueCookies)
Vue.use(vuePayKeyboard)
Vue.use(VueLazyLoad,{
    loading:'./assets/loading/loading-balls.svg'
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store:store,
    router,
    render: h => h(App)
})
