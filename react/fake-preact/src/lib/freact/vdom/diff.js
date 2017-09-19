import { createNode, setAccessor } from '../dom';
import { buildComponentFromVNode } from './component';

import render from '../render';

function isNamedNode(node, nodeName) {
  const res = node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
  return res;
}

export function diff(dom, vnode, parent) {
  const ret = idiff(dom, vnode, parent);
  if (parent && ret.parentNode !== parent) parent.appendChild(ret);

  return ret;
}

function idiff(dom, vnode, parent) {
  console.log('==== diff function start ====\n', dom, vnode, parent);

  let out;
  // 如果传入的是字符串，就返回文本节点，因为会递归调用 render 处理子节点，而子节点可能是纯文本
  if (typeof vnode === 'string') {
    out = document.createTextNode(vnode);
    // 如果存在 dom，就表示是更新
    // if (dom) {
    //   if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
    //   return;
    // }
    // if (parent) {
    //   parent.appendChild(out);
    //   return;
    // }
    return out;
  }

  let vnodeName = vnode.nodeName;
  // 如果是自定义组件
  if (typeof vnodeName === 'function') {
    console.log(vnodeName, 'is component');
    return buildComponentFromVNode(vnode, parent);
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
      if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
    }
  }

  // 处理子元素
  let fc = out.firstChild;
  let vchildren = vnode.children;

  // 如果子元素只有一个，且是字符串，就表示这个子元素就是文本，直接插入
  if (vchildren
    && vchildren.length === 1
    && typeof vchildren[0] === 'string'
    && fc !== null
    && fc.splitText !== undefined
    && fc.nextSibling === null
  ) {
    if (fc.nodeValue !== vchildren[0]) {
      fc.nodeValue = vchildren[0];
    }
  }
  // 否则，就表示子元素是“复杂”的，可能是原生 DOM，也可以是自定义组件
  else if (vchildren && vchildren.length || fc !== null) {
    // innerDiffNode(out, vchildren);
    vchildren.forEach((child) => {
      diff(null, child, out);
    });
  }

  // 给 DOM 添加属性
  const attributes = vnode.attributes || {};
  Object.keys(attributes).forEach(k => setAccessor(out, k, attributes[k]));

  console.log('==== diff function end ====\n', out);
  return out;
}
