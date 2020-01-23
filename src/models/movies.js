import {FilterType} from '../utils/const.js';

export const getMoviesByFilter = (movies, filter) => {
  switch (filter) {
    case FilterType.ALL:
      return movies;
    case FilterType.WATCHLIST:
      return movies.filter((it) => (it.inWatchlist));
    case FilterType.HISTORY:
      return movies.filter((it) => it.isWatched);
    case FilterType.FAVORITES:
      return movies.filter((it) => it.isFavorite);
  }
  return movies;
};

export default class Movies {
  constructor() {
    this._movies = [];
    this._activeFilterType = FilterType.ALL;

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  getMovies() {
    return getMoviesByFilter(this._movies, this._activeFilterType);
  }

  getMoviesAll() {
    return this._movies;
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updateMovie(id, movie) {
    const index = this._movies.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    this._movies = [...this._movies.slice(0, index), movie, ...this._movies.slice(index + 1)];
    this._dataChangeHandlers.forEach((handler) => handler());
    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
