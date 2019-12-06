import {createElement} from '../util.js';

const createStatsTemplate = (movieCount) => {
  return `<section class="footer__statistics">
            <p>${movieCount} movies inside</p>
          </section>`;
};


export default class Footer {
  constructor(movieCount) {
    this._movieCount = movieCount;
    this._element = null;
  }

  getTemplate() {
    return createStatsTemplate(this._movieCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

