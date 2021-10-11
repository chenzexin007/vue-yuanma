let Vue;
class Store {
  constructor(options){

    this.mutations = options.mutations
    this.actions = options.actions
    this._wrapGetter = options.getters

    // getters的使用类似于computed, 但是他又带有参数
    // 实现思路是： 
    // 1.使用Vue借鸡生蛋，接用computed
    // 2.向computed中植入我们的getters的key-function，并且是带state参数的 
    let computed = {}
    this.getters = {}
    const store = this

    Object.keys(this._wrapGetter).forEach(key => {
      const fn = store._wrapGetter[key]
      computed[key] = function(){
        return fn(store.state)
      }
      Object.defineProperty(store.getters, key, {
        get(){
          return store._vm[key]
        }
      })
    })
    this._vm = new Vue({
      data: {
        $$state: options.state
      },
      computed
    })
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  get state(){
    return this._vm._data.$$state
  }

  set state(v){
    // 重写实现set、get
    // 拦截set，不然用户直接修改state， 实现vuex的单向数据流
    console.warn('please use replaceState methods to change state')
  }

  // 实现commit
  commit(type, payload){
    console.log(type, this.mutations)
    let mutation = this.mutations[type]
    if(!mutation){
      console.error('is a not defined mutation')
      return
    }
    mutation(this.state, payload)
  }

  // 实现dispatch
  dispatch(type, payload){
    const ation = this.actions[type]
    if(!ation){
      console.error('is a not defined ation')
      return
    }
    ation(this, payload)    // 这里传递this，但是this会被外部修改，所以我们在构造函数那里都将this直接指向vue  
  }
}
function install(_Vue){
  Vue = _Vue
  Vue.mixin({   // 全局混入的模式挂载实现this.$store, 因为配置main.js在获得，所以这里是延迟获取options下的store
    beforeCreate(){
      if(this.$options.store){
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default { Store, install }