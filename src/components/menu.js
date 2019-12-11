import AbstractComponent from './abstract-component.js';

const createFiltersTemplate = (filters) => {
  return filters.map((filter) => {
    const {title, href, count, isActive} = filter;
    const activeClass = isActive ? `main-navigation__item--active` : ``;
    const countTemplate = count ? `<span class="main-navigation__item-count">${count}</span>` : ``;
    return `<a href="#${href}" class="main-navigation__item ${activeClass}">${title} ${countTemplate}</a>`;
  })
  .join(`\n`);
};

const createMenuTemplate = (filters) => {
  const filtersTemplate = createFiltersTemplate(filters);

  return `<nav class="main-navigation">
            ${filtersTemplate}
            <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
          </nav>`;
};


export default class SiteMenu extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }
  getTemplate() {
    return createMenuTemplate(this._filters);
  }
}
