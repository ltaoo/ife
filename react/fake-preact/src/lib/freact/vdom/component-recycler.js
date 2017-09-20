const components = {};
/**
 * 创建组件
 * @param {Component} Ctor 组件，即我们自己声明的 class
 */
export function createComponent(Ctor, props, context) {
  /**
   * Ctor = f App(props)
   * props = {children: []}
   * context = {}
   */
  let list = component[Ctor.name], inst;
  // 如果存在 render 方法
  if (Ctor.prototype && Ctor.prototype.render) {
    inst = new Ctor(props, context);
  }
	return component;
}
