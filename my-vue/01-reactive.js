// 本js目的： 熟悉Object.defineprototype的使用，为实现vue数据响应做准备
function relactive(obj, key, val){
  observe(val) // 这里解决嵌套对象
  Object.defineProperty(obj, key, {
    get(){
      console.log(key +  ': get')
      return val
    },
    set(newVal){
      console.log(key + ': set')
      observe(newVal)  // 若新赋值为一个全新对象，需要对里面的key进行响应式处理
      val = newVal
    }
  })
}

// 简单实现vue中的set，以解决新增的key也能够响应式
function set(obj, key ,val){
  relactive(obj, key, val)
}

// 处理obj有多个key的时候
function observe(obj){
  if(typeof(obj) !== 'object' || obj === null){
    return
  }
  Object.keys(obj).forEach(key => {
    relactive(obj, key, obj[key])
  })
}

var obj = {
  foo:'',
  bar: {
    a: ''
  }
}
observe(obj)
obj.foo
obj.foo = 'foo'
obj.bar = {
  b: 'b'
}
obj.bar.b
set(obj.bar, 'c', '')
obj.bar.c = 'c'