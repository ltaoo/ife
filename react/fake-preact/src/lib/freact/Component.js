import { enqueueRender } from './render-queue';

export default class Component {
	constructor(props) {
		this.props = props;
	}

	render() {
		console.log('render');
	}

	setState(newState) {
		console.log('setState', newState);
    // 保存旧 state
    if (!this.prevState) this.prevState = Object.assign({}, this.state);
    // 覆盖旧 state
    this.state = newState;
    enqueueRender(this);
	}
}
