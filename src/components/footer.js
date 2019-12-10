import AbstractComponent from './abstract-component.js';

const createStatsTemplate = (movieCount) => {
  return `<section class="footer__statistics">
            <p>${movieCount} movies inside</p>
          </section>`;
};


export default class Footer extends AbstractComponent {
  constructor(movieCount) {
    super();
    this._movieCount = movieCount;
  }

  getTemplate() {
    return createStatsTemplate(this._movieCount);
  }
}

