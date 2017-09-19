import freact, { h, render } from './lib/freact';
// import preact, { h, render } from './lib/preact/preact';

import App from './components/app';

const button = <button onClick={() => console.log('click')}>click</button>;

// const realElement = render(<App />);
// document.body.appendChild(realElement);

render(<App />, document.getElementById('app'));
