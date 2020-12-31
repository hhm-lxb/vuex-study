import Module from './module'
import { forEach } from '../utils'
export default class ModuleCollection {
  constructor (rawRootModule) {
    // 注册模块
    this.register([], rawRootModule)
  }
  register (path, rawModule) {
    // path 模块的数组
    // rowModule 当前模块
    const newModule = new Module(rawModule)

    if (path.length === 0) { // 说明是根模块
      this.root = newModule
    } else {
      // 找到父级模块 把当前模块添加到父级模块中
      const parent = path.slice(0, -1).reduce((prev, next) => {
        return prev.getChild[next]
      }, this.root)
      parent.addChild([path[path.length - 1]], newModule)
    }

    
    // 递归注册模块
    if (rawModule.modules) {
      forEach(rawModule.modules, (module, moduleName) => {
        this.register(path.concat(moduleName), module)
      })
    }
  }
  getNamespace (path) { // 从前往后获取命名空间
    let module = this.root
    return path.reduce((moduleName, key) => {
      module = module.getChild(key)
      return moduleName + (module.namespaced ? key + '/'  : '')
    }, '')
  }
}