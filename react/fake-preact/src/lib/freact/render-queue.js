import { renderComponent } from './vdom/component';

/** Managed queue of dirty components to be re-rendered */

let items = [];

export function enqueueRender(component) {
  // 如果这个组件
  if (!component._dirty && (component._dirty = true) && items.push(component) === 1) {
    // (options.debounceRendering || defer)(rerender);
    Promise.resolve().then(rerender);
  }
}

export function rerender() {
  let p, list = items;
  items = [];
  while ( (p = list.pop()) ) {
    if (p._dirty) {
      console.log('rerender component', p);
      renderComponent(p);
    }
  }
}
