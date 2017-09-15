import { h, Component } from '../lib/freact';

export default class App extends Component {
	render() {
		return h('div', {
			id: 'test'
		}, 'App component');
	}
}
