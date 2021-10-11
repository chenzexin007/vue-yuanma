/**
 * router的实现有bug:
1. /about 会直线显示/about/info的视图（发现是render函数执行了两次，我使用缓存match数组还是会触发两次，懵逼了）
2. if(route.children){ this.matched() }  return; 这会导致永远只能匹配第一个子路由，也就是我加一个/about/info2 ，但是他永远只会渲染匹配到的第一个/about/info
 */

let Vue; // 保存Vue构造函数，插件中使用
class VueRouter{
  constructor(options){
    console.log(options)
    this.$options = options
    // 使用vue2提供的工具，将currentRoute变为响应数据, 
    // Vue.definedProperty太底层，需要添加代码处理，不适合
    // Vue.$set 是在响应式对象后面追加响应数据，不适用本场景
    // Vue.util.defineReactive 将一个数据变为响应式数据
    // const initial = window.location.hash.slice(1) || '/'   //  为了解决嵌套路由的问题，我们这里不再使用this.currentRoute,而是通过deep在match路由数组中匹配路由
    // Vue.util.defineReactive(this, 'currentRoute', initial)
    this.currentRoute = window.location.hash.slice(1) || '/'
    Vue.util.defineReactive(this, 'match', [])
    this.matched()
    window.addEventListener('hashchange', () => {
      this.currentRoute = window.location.hash.slice(1)
      this.match = []
      this.matched()
      console.log(this.currentRoute)
    })
  }
  matched(routes){ // 递归获取路由层级
    routes = routes || this.$options.routes
    for(let route of routes){
      // 像 /根路由下一版不会有子路由，如果配置子路由，其他路由都将无效， 所以这里直接暴力认为/直接结束递归
      if(route.path === '/' && this.currentRoute === '/'){
        this.match.push(route)
        return
      }
      // /about/info
      if(route.path !== '/' && route.path.indexOf('/') !== -1){
        this.match.push(route)
        if(route.children){
          this.matched(route.children)
        }
        return
      }
    }

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
      // 先获取深度， 是第几级的路由，然后通过递归得到的路由数组进行路由定位
      this.$vnode.data.isRouterView = true
      let parent = this.$parent
      let deep = 0; // 这个就是标记的深度，用来解决嵌套路由的问题（children）
      while(parent){
        const vnodeData = parent.$vnode && parent.$vnode.data
        if(vnodeData){
          if(vnodeData.isRouterView){
            deep++
          }
        }
        parent = parent.$parent
      }
      console.log(deep, this.$router.match)
      let component = null
      // const route = this.$router.$options.routes.find( route => {
      //   console.log(route, this.$router.currentRoute)
      //   return route.path == this.$router.currentRoute
      // } )
      const route = this.$router.match[deep]
      if(route){
        component = route.component
      }
      return h(component)
    }
  })
}
export default VueRouter;