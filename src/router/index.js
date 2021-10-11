import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

// VueRouter是一个插件， 它做了什么？
// 第一步： vue.use(插件)会执行  插件中的 install 方法
// install中的具体实现：
//           1) 注册组件 router-view和router-link:
//                    使用Vue.component()  
//           2) 实现this.$router
//                    使用Vue.mixin 全局混入， 在beforedCreated中判断this.$options.router(在每一个vue实例中都会执行判断，但是只有根实例中有)，
//                    Vue.prototype.$router = this.$options.router,通过原型链继承这样就可以在每一个vue中使用this.$router
//                    这里之所以使用全局混入，是因为Vue.use(VueRouter)时，router的那些配置都没配置好，等main中new Vue({ router })的时候，才能
//                    在根实例下this.$options找到router，并注入到prototype
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children: [
      {
        path: '/about/info',
        name: 'info',
        component: { render(h){ return h('div', 'info path') } }
      }
    ]
  }
]
// 第二步，创建实例 （第三步在main.js中）
const router = new VueRouter({
  routes
})

export default router
