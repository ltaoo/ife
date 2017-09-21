import { createNode, setAccessor } from '../dom';
import { buildComponentFromVNode } from './component';

import render from '../render';

function isNamedNode(node, nodeName) {
  const res = node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
  return res;
}

export function diff(dom, vnode, context, mountAll, parent, componentRoot) {
  /**
   * dom = undefined
   * vnode = {
   *    nodeName: f,
   *    key: undefined,
   *    attributes: undefined,
   *    children: []
   * }
   * context = {}
   * parent = div#app
   * componentRoot = false 
   */
  /**
   * dom = undefined
   * vnode = {
   *    nodeName: 'div',
   *    children: [{
   *      nodeName: 'p',
   *      children: ['my name is: ltaoo'],
   *      attributes: undefined,
   *      key: undefined
   *    }, {
   *      nodeName: 'button',
   *      children: ['click'],
   *      attributes: {
   *        onClick: f
   *      },
   *      key: undefined
   *    }],
   *    attributes: undefined,
   *    key: undefined
   * }
   * context = {}
   * parent = undefined
   * componentRoot = true 
   */
  const ret = idiff(dom, vnode, context, mountAll, componentRoot);
  // 最终这里得到 ret 是组装好的 dom 树
  if (parent && ret.parentNode !== parent) parent.appendChild(ret);

  return ret;
}
/**
 * 
 * @param {Element} dom 要做 dom diff 的 dom
 * @param {VNode} vnode 要做 dom diff 的 vnode
 */
function idiff(dom, vnode, context, mountAll, componentRoot) {
  /**
   * dom = undefined
   * vnode = {
   *    nodeName: f,
   *    key: undefined,
   *    attributes: undefined,
   *    children: []
   * }
   * context = {}
   * mountAll = false
   * componentRoot = false
   */
  /**
   * dom = undefined
   * vnode = {
   *    nodeName: 'div',
   *    children: [{
   *      nodeName: 'p',
   *      children: ['my name is: ltaoo'],
   *      attributes: undefined,
   *      key: undefined
   *    }, {
   *      nodeName: 'button',
   *      children: ['click'],
   *      attributes: {
   *        onClick: f
   *      },
   *      key: undefined
   *    }],
   *    attributes: undefined,
   *    key: undefined
   * }
   * context = {}
   * mountAll = true
   * componentRoot = true
   */
  /**
   * dom = null
   * vnode = {
   *    nodeName: 'p',
   *    key: undefined,
   *    attributes: undefined,
   *    children: ['my name is: ltaoo']
   * }
   * context = {}
   * mountAll = true
   * componentRoot = undefined
   */
  /**
   * dom = null
   * vnode = 'my name is: ltaoo'
   * context = {}
   * mountAll = true
   * componentRoot = undefined
   */
  /**
   * dom = null
   * vnode = {
   *    nodeName: 'button',
   *    key: undefined,
   *    attributes: {
   *      onClick: f
   *    },
   *    children: ['click']
   * }
   * context = {}
   * mountAll = true
   * componentRoot = undefined
   */
  /**
   * dom = null
   * vnode = 'click'
   * context = {}
   * mountAll = true
   * componentRoot = undefined
   */
  console.log('==== diff function start ====\n', dom, vnode);

  let out = dom;
  // 如果传入的是字符串，就返回文本节点
  if (typeof vnode === 'string') {
    out = document.createTextNode(vnode);
    // 如果存在 dom，就表示是更新
    if (dom) {
      console.log('update dom');
      if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
      return;
    }
    return out;
  }

  let vnodeName = vnode.nodeName;
  // 如果是自定义组件
  if (typeof vnodeName === 'function') {
    console.log(vnodeName, 'is component');
    return buildComponentFromVNode(dom, vnode, context, mountAll);
  }

  // 原生 element
  vnodeName = String(vnodeName);
  // 如果不是 dom diff，就表示是创建 dom
  if (!dom || !isNamedNode(dom, vnodeName)) {
    // 得到 Element 类型的 dom
    out = createNode(vnodeName);
    // 如果是更新 dom
    if (dom) {

    }
  }

  // out 是渲染的 div，这里取到子元素，为 null
  let fc = out.firstChild;
  // let props = out[ATTR_KEY];
  let props = {};
  // 以及 vnode 的子元素 p 和 button
  let vchildren = vnode.children;

  // 如果子元素只有一个，且是字符串，就表示这个子元素就是文本，直接插入
  if (
    vchildren
    && vchildren.length === 1
    && typeof vchildren[0] === 'string'
    && fc !== null
    && fc.splitText !== undefined
    && fc.nextSibling === null
  ) {
    if (fc.nodeValue !== vchildren[0]) {
      console.log('update text');
      fc.nodeValue = vchildren[0];
    }
  }
  // 否则，就表示子元素是“复杂”的，可能是原生 DOM，也可以是自定义组件
  else if (vchildren && vchildren.length || fc !== null) {
    innerDiffNode(out, vchildren, context, mountAll);
  }

  // 对 dom 属性进行 diff
  diffAttributes(out, vnode.attributes, props);

  console.log('==== diff function end ====\n', out);
  return out;
  /**
   * 第一次：out = text node: my name is: ltaoo
   */
  /**
   * 第二次：out = p
   */
  /**
   * 第三次：out = text node: click
   */
  /**
   * 第四次：out = button
   */
}

/**
 *
 *  @param {Element} dom      Element whose children should be compared & mutated
 *  @param {Array} vchildren    Array of VNodes to compare to `dom.childNodes`
 *  @param {Object} context     Implicitly descendant context object (from most recent `getChildContext()`)
 *  @param {Boolean} mountAll
 *  @param {Boolean} isHydrating  If `true`, consumes externally created elements similar to hydration
 */
function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
  /**
   * dom = div
   * vchildren = [{
   *      nodeName: 'p',
   *      children: ['my name is: ltaoo'],
   *      attributes: undefined,
   *      key: undefined
   *    }, {
   *      nodeName: 'button',
   *      children: ['click'],
   *      attributes: {
   *        onClick: f
   *      },
   *      key: undefined
   *    }]
   * context = {}
   * mountAll = true
   * isHydrating = false
   */
   /**
   * dom = p
   * vchildren = ['my name is: ltaoo']
   * context = {}
   * mountAll = true
   * isHydrating = false
   */
  console.log('---- inner diff node function start ----\n', dom, vchildren);
  // 原生 DOM 下的子元素
  let originalChildren = dom.childNodes;
  let children = [];
  // 原生 DOM 下子元素数量
  let len = originalChildren.length;
  let childrenLen = 0;
  let min = 0;
  // vnode 子元素长度
  let vlen = vchildren ? vchildren.length : 0;
  let j, c, f, vchild, child;

  // 如果 dom 存在子元素，就遍历它
  if (len !== 0) {
    // 遍历真实 DOM 下的子元素
    for (let i = 0; i < len; i ++) {
      let child = originalChildren[i];
      children[childrenLen++] = child;
    }
  }
  // 如果 vchildren 存在，就遍历
  if (vlen !== 0) {
    // 遍历 vnode 下的子元素
    for (let i = 0; i < vlen; i++) {
      vchild = vchildren[i];
      // 第一次拿到 p 这个 vnode
      child = null;

      // 每个 vnode 都会有 key 属性，虽然大部分情况都是 undefined
      let key = vchild.key;
      // 如果存在 key，尝试能否拿到 child
      if (key !== null || key !== undefined) {

      }
      // 或者存在子元素
      else if (!child && min < childrenLen) {

      }

      // 将指定的一个子元素进行 dom diff
      child = idiff(child, vchild, context, mountAll);
      /**
       * child = text node: my name is: ltaoo
       */
      f = originalChildren[i];
      // 如果子元素存在 child = text node | dom = p | f = undefined
      if (child && child !== dom && child !== f) {
        // 如果节点为空，就表示是 create DOM
        if (f === null || f === undefined) {
          // 实际上初始化时渲染 dom 到页面上是通过这里
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          // dom.insertBefore(child, f);
        }
      }
    }
  }
}

function diffAttributes(dom, attrs, old) {
  // const attributes = vnode.attributes || {};
  // Object.keys(attributes).forEach(k => setAccessor(out, k, attributes[k]));
  /**
   * dom = p
   * attrs = undefined
   * old = {}
   */
  let name;

  // 遍历旧属性值
  for (name in old) {
    if (!(attrs && attrs[name]!=null) && old[name]!=null) {
      setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
    }
  }

  // add new & update changed attributes
  for (name in attrs) {
    if (
      name !== 'children'
      && name !== 'innerHTML'
      && (
        !(name in old)
        || attrs[name] !== (name==='value'|| name === 'checked' ? dom[name] : old[name])
      )
    ) {
      setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    }
  }
}
