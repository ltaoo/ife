// import { h, Component } from '../lib/freact';
import { h, Component } from '../lib/preact/preact';

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
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState({
			name: 'wuya',
		});
	}

	render() {
		const { name } = this.state;
		return <div>
			<p>my name is: {name}</p>
			<button onClick={this.handleClick}>click</button>
		</div>;
	}
}
