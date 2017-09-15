import freact, { h, render } from './lib/freact';

import App from './components/app';

const realNode = render(h(App));
console.log(realNode);

document.body.appendChild(realNode);
