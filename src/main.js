import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入Element-UI组件
import ElementUI from 'element-ui'
// 引入element主体文件
import 'element-ui/lib/theme-chalk/index.css'
// 引入全局样式
import './styles/index.scss'

// 注册为Vue插件
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
