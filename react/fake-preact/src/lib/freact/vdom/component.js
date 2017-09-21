import render from '../render';
import { diff } from './diff';
import { createComponent } from './component-recycler';

/**
 * 渲染的方式，
 * 1: 同步
 */
const NO_RENDER = 0;
const SYNC_RENDER = 1;
const ASYNC_RENDER = 2;
/**
 * 根据 vnode 创建自定义组件
 */
export function buildComponentFromVNode(dom, vnode, context, mountAll) {
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
   */
  const c = createComponent(vnode.nodeName, vnode.attributes);
  // 初始化时 dom = undefined，所以跳过这里
  if (dom && !c.nextBase) {

  }
  setComponentProps(c, vnode.attributes, SYNC_RENDER, context, mountAll);

  // c.base 是原生 DOM
  return c.base;
}

/**
 *
 */
export function setComponentProps(component, props, opts, context, mountAll) {
  /**
   * component = {
   *    _dirty: false,
   *    context: {},
   *    props: {
   *      children: []
   *    },
   *    state: {
   *      name: 'ltaoo'
   *    },
   *    handleClick: f
   * }
   * props = {
   *    children: []
   * }
   * opts = 1
   * context = false
   * mountAll = false
   */
  if (component._disable) {
    return;
  }
  // 将组件置为 “不可用” 状态，表示该组件已经设置过状态了吗
  component._disable = true;
  // willMount 生命周期
  if (!component.base || mountAll) {
    if (component.componentWillMount) component.componentWillMount();
  }

  if (context && context !== component.context) {

  }
  // 处理 props
  if (!component.prevProps) {
    component.prevProps = component.props;
  }
  component.props = props;
  // 设置好 props 后，又将 _disable 置为 false，表示又可以重新设置 props 了吗
  component._disable = false;

  // 如果 不是 “不渲染”
  if (opts !== NO_RENDER) {
    // 如果是同步渲染，或者 component 不存在 base，base 即渲染得到的 dom
    if (opts === SYNC_RENDER || !component.base) {
      renderComponent(component, SYNC_RENDER, mountAll);
    }
  }
}

/**
 *
 */
export function renderComponent(component, opts, mountAll, isChild) {
  /**
   * component = {
   *    _dirty: false,
   *    context: {},
   *    props: {
   *      children: []
   *    },
   *    state: {
   *      name: 'ltaoo'
   *    },
   *    handleClick: f
   * }
   * opts = 1
   * mountAll = false
   * isChild = undefined
   */
  console.log('==== renderComponent function start ====\n', component);

  if (component._disable) {
    return;
  }
  // 首先拿到一系列变量
  let props = component.props;
  let state = component.state;
  let context = component.context;
  let previousProps = component.prevProps || props;
  let previousState = component.prevState || state;
  let componentContext = component.prevContext || context;
  // 如果之前存在 base，并且还要渲染，就表示这次是更新 dom
  let isUpdate = component.base;
  let nextBase = component.nextBase;
  let initialBase = isUpdate || nextBase;
  let initialChildComponent = component._component;
  let skip = false;
  let rendered, inst, cbase;

  // 如果是更新组件
  if (isUpdate) {
    // 调用生命周期
  }

  // 更新完毕，或者不是更新组件，都将这些属性置为 null
  component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
  component._dirty = false;

  if (!skip) {
    // 得到的是 vnode
    rendered = component.render(props, state, context);
    /**
     * rendered = {
     *    nodeName: 'div',
     *    children: [{
     *      nodeName: 'p',
     *      children: ['my name is: latoo'],
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
     *    key: undefined,
     * }
     */
    if (component.getChildContext) {
    }

    // 子组件，比如 <App /> 组件的子组件就是 <div>
    let childComponent = rendered && rendered.nodeName;
    let toUnmount, base;
    // 存在子元素
    if (typeof childComponent === 'function') {

    } else {
      // 两个都是 undefined
      cbase = initialBase;
      toUnmount = initialChildComponent;
      if (toUnmount) {

      }

      // 如果 InitialBase 存在，或者 opts 是同步渲染，都会调用 diff 函数
      if (initialBase || opts === SYNC_RENDER) {
        if (cbase) cbase._component = null;
        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
        // 这里得到的是原生 DOM 树
      }
    }
    // 给原生 DOM 添加一些属性
    if (base && !isChild) {
      let componentRef = component,
        t = component;
      while ((t=t._parentComponent)) {
        (componentRef = t).base = base;
      }
      base._component = componentRef;
      base._componentConstructor = componentRef.constructor;
    }
    component.base = base;
  }

  console.log('==== renderComponent function end ===\n', component);
}
