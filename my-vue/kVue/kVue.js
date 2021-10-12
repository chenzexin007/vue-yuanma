
function defineReactive(obj, key, val){
  observe(val)
  Object.defineProperty(obj, key, {
    get(){
      console.log(key, ': get')
      return val
    },
    set(newVal){
      console.log(key, ': set')
      observe(val)
      val = newVal
    }
  })
}
function observe(obj){
  if(typeof(obj) !== 'object' || obj === null){
    return
  }
  new Observe(obj)
}
class kVue{
  constructor(options){
    this.$options = options
    this.$data = options.data
    // 1. 实现数据响应
    observe(this.$data)
    // 代理 将 this.$data.count 变成 this.count访问
    proxy(this)
  }
}
// 代理
function proxy(vm){
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, { // 关注get的返回和set的设置
      get(){  
        return vm.$data[key]
      },
      set(newVal){
        vm.$data[key] = newVal
      }
    })  
  })
}
// 处理data是数组还是对象
class Observe{
  constructor(value){
    if(Array.isArray(value)){
      // 数组
    }else {
      this.walk(value)
    }
  }
  // 对象响应式
  walk(obj){
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}
// 2. 实现模板编译