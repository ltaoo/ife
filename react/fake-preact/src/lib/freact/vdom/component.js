import render from '../render';
import { createComponent } from './component-recycler';

/**
 *
 */
export function buildComponentFromVNode(vnode, parent) {
  const c = createComponent(vnode.nodeName, vnode.attributes);
  setComponentProps(c, parent);

  // c.base 是原生 DOM
  // parent.appendChild(c.base);
  return c.base;
}

/**
 *
 */
export function setComponentProps(component, parent) {
  renderComponent(component, parent);
}

/**
 *
 */
export function renderComponent(component, parent) {
  const rendered = component.render();
  console.log('rendered in renderComponent', rendered);
  // 存在子元素
  component.base = render(rendered, parent);
}
