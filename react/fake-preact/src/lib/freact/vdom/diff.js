import { createNode, setAccessor } from '../dom';
import { buildComponentFromVNode } from './component';

import render from '../render';

function isNamedNode(node, nodeName) {
  const res = node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
  return res;
}

export function diff(dom, vnode, parent) {
  /**
   * dom = undefined
   * vnode = {
   *    nodeName: f,
   *    key: undefined,
   *    attributes: undefined,
   *    children: []
   * }
   * parent = div#app
   */
  const ret = idiff(dom, vnode, parent);
  if (parent && ret.parentNode !== parent) parent.appendChild(ret);

  return ret;
}

function idiff(dom, vnode, context, mountAll, componentRoot) {
  console.log('==== diff function start ====\n', dom, vnode, parent);

  let out = dom;
  // 如果传入的是字符串，就返回文本节点，因为会递归调用 render 处理子节点，而子节点可能是纯文本
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
    return buildComponentFromVNode(vnode);
  }

  // 原生 element
  vnodeName = String(vnodeName);
  if (!dom || !isNamedNode(dom, vnodeName)) {
    out = createNode(vnodeName);

    // (vnode.children || []).forEach(c => idiff(out, c, out));

    if (dom) {
      // move children into the replacement node
      while (dom.firstChild) out.appendChild(dom.firstChild);

      // if the previous Element was mounted into the DOM, replace it inline
      console.log('update dom');
      if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
    }
  }

  // 处理子元素
  let fc = out.firstChild;
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
    innerDiffNode(out, vchildren);
  }

  // 给 DOM 添加属性
  const attributes = vnode.attributes || {};
  Object.keys(attributes).forEach(k => setAccessor(out, k, attributes[k]));

  console.log('==== diff function end ====\n', out);
  return out;
}

/** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
 *  @param {Element} dom      Element whose children should be compared & mutated
 *  @param {Array} vchildren    Array of VNodes to compare to `dom.childNodes`
 *  @param {Object} context     Implicitly descendant context object (from most recent `getChildContext()`)
 *  @param {Boolean} mountAll
 *  @param {Boolean} isHydrating  If `true`, consumes externally created elements similar to hydration
 */
function innerDiffNode(dom, vchildren) {
  console.log('---- inner diff node function start ----\n', dom, vchildren);
  // 原生 DOM 下的子元素
  let originalChildren = dom.childNodes;
  let children = [];
  // 原生 DOM 下子元素数量
  let len = originalChildren.length;
  let childrenLen = 0;
  // vnode 子元素长度
  let vlen = vchildren ? vchildren.length : 0;
  let j, c, f, vchild, child;

  // Build up a map of keyed children and an Array of unkeyed children:
  if (len !== 0) {
    // 遍历真实 DOM 下的子元素
    for (let i = 0; i < len; i ++) {
      let child = originalChildren[i];
      children[childrenLen++] = child;
    }
  }

  if (vlen !== 0) {
    // 遍历 vnode 下的子元素
    for (let i = 0; i < vlen; i++) {
      vchild = vchildren[i];
      child = null;
      // 要在这个地方拿到原始 DOM
      child = children[i];
      // morph the matched/found/created DOM child to match vchild (deep)
      child = idiff(child, vchild);

      f = originalChildren[i];
      if (child && child !== dom && child !== f) {
        // 如果节点为空，就表示是 create DOM
        if (f === null || f === undefined) {
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
