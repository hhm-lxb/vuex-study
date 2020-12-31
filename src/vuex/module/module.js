import { forEach } from '../utils'

export default class Module {
  constructor (rawModule) {
    this._children = Object.create(null)
    this._rawModule = rawModule
    this.state = rawModule.state
  }
  get namespaced () {
    // 直接变成布尔值
    return !!this._rawModule.namespaced
  }
  addChild (key, module) {
    this._children[key] = module
  }
  getChild (key) {
    return this._children[key]
  }
  removeChild (key) {
    delete this._children[key]
  }
  forEachChild (fn) {
    forEach(this._children, fn)
  }

  forEachGetter (fn) {
    if (this._rawModule.getters) {
      forEach(this._rawModule.getters, fn)
    }
  }

  forEachAction (fn) {
    if (this._rawModule.actions) {
      forEach(this._rawModule.actions, fn)
    }
  }

  forEachMutation (fn) {
    if (this._rawModule.mutations) {
      forEach(this._rawModule.mutations, fn)
    }
  }
}