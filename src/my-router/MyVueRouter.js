let Vue; // 保存Vue构造函数，插件中使用
class VueRouter{
  constructor(options){
    console.log(options)
    this.$options = options
    // 使用vue2提供的工具，将currentRoute变为响应数据, 
    // Vue.definedProperty太底层，需要添加代码处理，不适合
    // Vue.$set 是在响应式对象后面追加响应数据，不适用本场景
    // Vue.util.defineReactive 将一个数据变为响应式数据
    const initial = window.location.hash.slice(1) || '/'
    Vue.util.defineReactive(this, 'currentRoute', initial)
    window.addEventListener('hashchange', () => {
      this.currentRoute = window.location.hash.slice(1)
      console.log(this.currentRoute)
    })
  }
}


VueRouter.install = function(_Vue){
  Vue = _Vue
  // 实现this.$router
  Vue.mixin({
    beforeCreate(){
      if(this.$options.router){
        Vue.prototype.$router = this.$options.router
        console.log(Vue.prototype.$router)
      }
    }
  })
  // 注册 router-view  和  router-link 两个全局组件
  Vue.component('router-link', {
    props:{
      to: {
        type: String,
        required: true
      }
    },
    render(h){
      return h('a',{ attrs: { href: '#' + this.to } },  this.$slots.default)
    }
  })
  Vue.component('router-view', {
    render(h){
      let component = null
      const route = this.$router.$options.routes.find( route => {
        console.log(route, this.$router.currentRoute)
        return route.path == this.$router.currentRoute
      } )
      if(route){
        component = route.component
      }
      return h(component)
    }
  })
}
export default VueRouter;