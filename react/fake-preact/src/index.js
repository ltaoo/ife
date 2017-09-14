import freact, { h } from './lib/freact';

console.log(freact);

const App = h('div', {
	className: 'container'
}, 'hello world');

console.log(App);
