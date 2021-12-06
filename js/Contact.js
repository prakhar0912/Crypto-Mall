import Plane from './gl/Plane';

document.body.classList.remove('loading');
const elements = document.querySelectorAll('.js-plane');
elements.forEach((el, index) => new Plane().init(el, index));
