// 入口文件
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './action'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// vuex自带的一个插件,控制台输出查看state改变流程
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// vuex的调试工具,检测我们对state的修改是否通过mutation,直接修改会报错,开发环境下进行严格模式的检测
const debug = process.env.NODE_ENV !== 'production'
// 相当于一个单例模式
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})