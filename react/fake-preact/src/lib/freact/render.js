import { diff } from './vdom/diff';

/**
 * 将 vdom 渲染成真实 DOM 节点
 * @param {*} vnode
 * @param {Element} parent 要插入的父节点
 * @param {Element} merge  要更新的节点
 */
export default function render(vnode, parent, merge) {
  /**
   * vnode = {
   *    nodeName: f,
   *    key: undefined,
   *    attributes: undefined,
   *    children: []
   * }
   * parent = div#app
   * merge = undefined
   */
  diff(merge, vnode, {}, false, parent, false);
}
