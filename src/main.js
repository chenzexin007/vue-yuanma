import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import router from './my-router'
// import store from './store'
import store from './my-store'

Vue.config.productionTip = false
// 第三步，将配置好的router放入到Vue根实例下的options对象中
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
