/**
 * 创建组件
 * @param {Component} Ctor 组件，即我们自己声明的 class
 */
export function createComponent(Ctor, props) {
  return new Ctor(props);
}