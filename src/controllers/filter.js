import SiteMenuComponent from '../components/menu.js';
import {FilterType, STATS} from '../utils/const.js';
import {getMoviesByFilter} from '../models/movies';
import {render, replace, RenderPosition} from '../utils/render.js';


export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.ALL;
    this._siteMenuComponent = null;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._dataChangeHandler = this._dataChangeHandler.bind(this);

    this._moviesModel.setDataChangeHandler(this._dataChangeHandler);

    this._menuChangeHandler = null;
  }

  render() {
    const container = this._container;
    const allMovies = this._moviesModel.getMoviesAll();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getMoviesByFilter(allMovies, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._siteMenuComponent;

    this._siteMenuComponent = new SiteMenuComponent(filters);
    this._siteMenuComponent.setFilterChangeHandler(this._filterChangeHandler);

    if (oldComponent) {
      replace(this._siteMenuComponent, oldComponent);
    } else {
      render(container, this._siteMenuComponent, RenderPosition.BEFOREEND);
    }
  }

  setMenuChangeHandler(handler) {
    this._menuChangeHandler = handler;
  }

  _filterChangeHandler(filterType) {
    if (filterType === STATS) {
      this._menuChangeHandler(true);
      return;
    }
    this._menuChangeHandler(false);
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _dataChangeHandler() {
    this.render();
  }
}
