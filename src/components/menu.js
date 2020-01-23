import AbstractComponent from './abstract-component.js';
import {FilterType} from '../utils/const.js';

const createFiltersTemplate = (filters) => {
  return filters.map((filter) => {
    const {name, count, checked} = filter;
    const activeClass = checked ? `main-navigation__item--active` : ``;
    const countTemplate = name !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ``;
    return `<a href="#" data-filter-type="${name}" class="main-navigation__item ${activeClass}">${name} ${countTemplate}</a>`;
  })
  .join(`\n`);
};

const createMenuTemplate = (filters) => {
  const filtersTemplate = createFiltersTemplate(filters);

  return `<nav class="main-navigation">
            ${filtersTemplate}
            <a href="#stats" data-filter-type="Stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
          </nav>`;
};


export default class SiteMenu extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._currentFilterType = FilterType.ALL;
  }
  getTemplate() {
    return createMenuTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const filterType = evt.target.dataset.filterType;

      if (this._currentFilterType === filterType) {
        return;
      }

      this._currentFilterType = filterType;
      this.getElement().querySelectorAll(`.main-navigation__item`).forEach((item) => {
        if (item.classList.contains(`main-navigation__item--active`)) {
          item.classList.remove(`main-navigation__item--active`);
        }
      });
      evt.target.classList.add(`main-navigation__item--active`);
      handler(this._currentFilterType);
    });
  }
}
