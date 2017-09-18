import freact, { h, render } from './lib/freact';

import App from './components/app';

const button = <button onClick={() => console.log('click')}>click</button>;
console.log(button);
console.log(render(button));

const realNode = render(<App />);
console.log(realNode);

document.body.appendChild(realNode);
