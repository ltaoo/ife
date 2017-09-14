/**
 * 返回虚拟 DOM 树
 * @param {String} nodeName
 * @param {Object} attributes
 * @param {Any} args
 * @return {Object}
 */
export default function h(nodeName, attributes, ...args) {
	const children = args.length ? [].concat(...args) : null;
	return {
		nodeName,
		attributes,
		children
	};
}
