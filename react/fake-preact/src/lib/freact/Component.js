export default class Component {
	constructor(props) {
		this.props = props;
	}

	render() {
		console.log('render');
	}

	setState(newState) {
		console.log('setState');
	}
}
