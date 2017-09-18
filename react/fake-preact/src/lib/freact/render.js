import { createNode, setAccessor } from './dom';
import { buildComponentFromVNode } from './vdom/component';

/**
 * 将 vdom 渲染成真实 DOM 节点
 * @param {*} vnode
 */
export default function render(vnode) {
	// 如果传入的是字符串，就返回文本节点，因为会递归调用 render 处理子节点，而子节点可能是纯文本
	if (vnode.split) return document.createTextNode(vnode);
  // 如果是自定义组件
  if (typeof vnode.nodeName === 'function') {
    return buildComponentFromVNode(vnode);
	}

  const dom = createNode(vnode.nodeName);
	const attributes = vnode.attributes || {};
	Object.keys(attributes).forEach(k => setAccessor(dom, k, attributes[k]));

	(vnode.children || []).forEach(c => dom.appendChild(render(c)));

	return dom;
}
