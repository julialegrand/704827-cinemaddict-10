import AbstractComponent from './abstract-component.js';
import {createElement} from '../utils/render.js';

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

const sortFilters = [
  {
    text: `Sort by default`,
    value: SortType.DEFAULT
  },
  {
    text: `Sort by date`,
    value: SortType.DATE
  },
  {
    text: `Sort by rating`,
    value: SortType.RATING
  }
];

const createSortTemplate = () => `<ul class="sort"></ul>`;

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currenSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate(this._currenSortType);
  }

  renderSortFilters() {
    const sortFilterElements = sortFilters.map(({value, text}) => {
      const activeClass = value === this._currenSortType ? `sort__button--active` : ``;
      return createElement(`<li><a href="#" data-sort-type="${value}" class="sort__button ${activeClass}">${text}</a></li>`);
    });
    sortFilterElements.forEach((sortElement) => {
      this._element.appendChild(sortElement);
    });
  }

  updateSortTemplate() {
    this.getElement().innerHTML = ``;
    this.renderSortFilters();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;
      this.updateSortTemplate();
      handler(this._currenSortType);
    });
  }
}
