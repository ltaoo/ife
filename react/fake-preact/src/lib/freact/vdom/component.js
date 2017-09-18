import render from '../render';
import { createComponent } from './component-recycler';

/**
 *
 */
export function buildComponentFromVNode(vnode) {
  const c = createComponent(vnode.nodeName, vnode.attributes);
  setComponentProps(c);

  // c.base 是原生 DOM
  return c.base;
}

/**
 *
 */
export function setComponentProps(component) {
  renderComponent(component);
}

/**
 *
 */
export function renderComponent(component) {
  const rendered = component.render();
  // 存在子元素
  component.base = render(rendered);
}
