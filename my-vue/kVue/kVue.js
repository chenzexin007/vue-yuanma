
function defineReactive(obj, key, val){
  observe(val)

  // 每对一个key添加响应式，我们就需要一个dep实例,用来装载订阅者
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get(){
      // console.log(key, ': get', Dep.target)
      // 收集依赖， vue源码在watcher的构造函数中主动触发get数据，来触发这里的手机依赖
      Dep.target && dep.addDep(Dep.target)
      if(dep.target){console.log(2)}
      return val
    },
    set(newVal){
      console.log(key, ': set')
      observe(val)
      val = newVal
      dep.notify()
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
    // 2. 编译模板 compile
    new Compile(options.el, this)
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
class Compile{
  constructor(el, vm){
    this.$el = document.querySelector(el);
    this.$vm = vm;
    if(this.$el){
      this.compile(this.$el)
    }
  }
  compile(el){
    const childNodes = el.childNodes
    childNodes.forEach(node => {
      if(node.nodeType === 1){  // 元素
        // console.log('元素：', node.nodeName)
        // 处理指令和事件
        const attrs = node.attributes
        Array.from(attrs).forEach(attr => {
          // 假设我们的自定义指令都是my-开头
          const attrName = attr.name
          const exp = attr.value
          if(attrName.startsWith('my-')){
            const dir = attrName.substring(3)
            // 自定匹配方法，eg   my-text
            this[dir] && this[dir](node, exp)
          }
        })
      }else if(this.isInter(node)){ //文本
        // console.log('文本：', node.textContent)
        this.compileText(node)
      }
  
      if(node.childNodes){
        this.compile(node)
      }
    })
  }

  // 在每一数据引用那里都需要创建watcher实例， 所以我们这里需要再抽一个高级函数
  update(node, exp, dir){
    // 初始化
    const fn = dir + 'Update'
    this[fn] && this[fn](node, exp)
    // 更新
    const that = this
    new Watcher(this.$vm, exp, function(v){
      // 通过闭包的写法，将更新dom的操作函数绑到一个watcher实例上面， 通过dep去调用定阅数组中watcher实例的update方法
      // 其实就是触发这里的方法
      that[fn] && that[fn](node, exp)
    } )
  }

  compileText(node){
    this.update(node, RegExp.$1, 'compileText')
    // node.textContent = this.$vm[RegExp.$1]
  }
  compileTextUpdate(node, exp){
    node.textContent = this.$vm[exp]
  }

  text(node, exp){
    this.update(node, exp, 'text')
    // node.textContent = this.$vm[exp]
  }
  textUpdate(node, exp){
    node.textContent = this.$vm[exp]
  }

  html(node, exp){
    this.update(node, exp, 'html')
    // node.innerHTML = this.$vm[exp]
  } 
  htmlUpdate(node, exp){
    node.innerHTML = this.$vm[exp]
  }
  
  isInter(node){
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
}

// 监听器  负责依赖更新，每个数据引用一次创建一个watcher实例
class Watcher{
  constructor(vm, key, updateFn){
    this.$vm = vm
    this.$key = key
    this.$updateFn = updateFn

    Dep.target = this
    this.$vm[this.$key]
    Dep.target = null
  }
  update(){
    this.$updateFn.call(this.$vm, this.$vm[this.$key])
  }
}

class Dep{
  constructor(){
    this.deps = []
  }

  addDep(watcher){
    this.deps.push(watcher)
  }

  notify(){
    console.log(1, this.deps)
    this.deps.forEach(w => {
      w.update()
    })
  }
}