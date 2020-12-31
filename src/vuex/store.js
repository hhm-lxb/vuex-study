import ModuleCollection from './module/module-collection'
import applyMixin from './mixin'
let Vue
class Store {
  constructor (options) {
    // 递归收集、格式化、注册模块
    this._wrappedGetters = Object.create(null)
    this._mutations = Object.create(null)
    this._actions = Object.create(null)
    this._modules = new ModuleCollection(options)
    console.log(this._modules)
    // 递归安装所有的模块
    let state= this._modules.root.state
    installModule(this, state, [], this._modules.root)
    // 添加响应式
    resetStoreVM(this, state)
  }
  commit (type, payload) {
    this._mutations[type].forEach(fn => {
      fn.call(this, payload)
    })
  }
  dispatch (type, payload) {
    this._actions[type].forEach(fn => {
      fn.call(this, payload)
    })
  }
}

function getNestedState (state, path) {
  return path.reduce((state, key) => state[key], state)
}

function installModule (store, rootState, path, module) {
  const isRoot = !path.length // 如果path是空数组就是根模块
  const namespace = store._modules.getNamespace(path)
  if (!isRoot) {
    // 设置state
    // 相当于在父级的state上加上了 state.childModule.name = childModule.state
    // 这也是为什么可以在this.$store.state.a.b 拿到a模块的b的值的原因
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    Vue.set(parentState, moduleName, module.state)
  }

  module.forEachGetter((getter, key) => {
    store._wrappedGetters[key] = function () {
      return getter.call(store, getNestedState(rootState, path))
    }
  })

  module.forEachMutation((mutation, type) => {
    type = namespace + type
    store._mutations[type] = (store._mutations[type] || [])
    store._mutations[type].push(payload => {
      mutation.call(store, getNestedState(rootState, path), payload)
    })
  })

  module.forEachAction((action, type) => {
    type = namespace + type
    store._actions[type] = (store._actions[type] || [])
    store._actions[type].push(payload => {
      action.call(store, store, payload)
    })
  })

  module.forEachChild((module, moduleName) => {
    installModule(store, rootState, path.concat(moduleName), module)
  })
}

function resetStoreVM (store, state) {
  let { _wrappedGetters, _mutations, _actions } = store
  console.log(store, state, _wrappedGetters, _mutations, _actions)
}
function install (_Vue) {
  Vue = _Vue
  applyMixin(Vue)
}

export {
  Store,
  install
}