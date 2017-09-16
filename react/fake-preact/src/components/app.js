import { h, Component } from '../lib/freact';

class Person extends Component {
	render() {
		return <div>person</div>;
	}
}

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: 'ltaoo',
		};
	}
	handleClick() {
		console.log('click');
		this.setState({
			name: 'wuya',
		});
	}

	render() {
		const { name } = this.state;
		return <div>
			<p>{name}</p>
			<button onClick={this.handleClick}>click</button>
		</div>;
	}
}
