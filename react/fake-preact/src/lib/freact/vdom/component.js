import render from '../render';
import { diff } from './diff';
import { createComponent } from './component-recycler';

/**
 * 根据 vnode 创建自定义组件
 */
export function buildComponentFromVNode(vnode, parent) {
  const c = createComponent(vnode.nodeName, vnode.attributes);
  setComponentProps(c, parent);

  // c.base 是原生 DOM
  return c.base;
}

/**
 *
 */
export function setComponentProps(component, parent) {
  component._parent = parent;
  const el = renderComponent(component);
  component._component = el;
}

/**
 *
 */
export function renderComponent(component, isChild) {
  console.log('==== renderComponent function start ====\n', component);
  // 首先拿到一系列变量
  let isUpdate = component.base;
  let initialBase = component.nextBase;

  let cbase;

  let base;

  // 如果是更新组件
  if (isUpdate) {
    // 调用生命周期
  }

  // 得到的是 vnode
  const rendered = component.render();
  // 子组件，比如 <App /> 组件的子组件就是 <div>
  let childComponent = rendered.nodeName;
  // 存在子元素
  if (typeof childComponent === 'function') {

  } else {
    cbase = component.base;
    // base = diff(cbase, rendered, initialBase && initialBase.parentNode);
    base = diff(cbase, rendered);
  }

  // if (initialBase && base !== initialBase) {
  //   let baseParent = initialBase.parentNode;
  //   if (baseParent && base !== baseParent) {
  //     baseParent.replaceChild(base, initialBase);
  //   }
  // }
  component.base = base;

  console.log('==== renderComponent function end ===\n', component);
  return component.base;
}
