import AbstractComponent from './abstract-component.js';

const createButtontempalte = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class Button extends AbstractComponent {

  getTemplate() {
    return createButtontempalte();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
