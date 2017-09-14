import freact, { h, render } from './lib/freact';

const App = h('div', {
	className: 'container'
}, 'hello world');
console.log(App);

const realNode = render(App);
console.log(realNode);

document.body.appendChild(realNode);
