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

  getWatchedMovies() {
    return getMoviesByFilter(this._movies, FilterType.HISTORY);
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  getMovieById(movieId) {
    return this._movies.find((it) => it.id === movieId);
  }

  updateMovie(movieId, newMovie) {
    const index = this._movies.findIndex((item) => item.id === movieId);
    if (index === -1) {
      return false;
    }
    newMovie.comments = this._movies[index].comments.slice();

    this._movies = [...this._movies.slice(0, index), newMovie, ...this._movies.slice(index + 1)];
    this._dataChangeHandlers.forEach((handler) => handler());
    return true;
  }

  updateComments(movieId, comments) {
    const movie = this.getMovieById(movieId);

    if (movie === null) {
      return false;
    }

    movie.comments = comments;

    return true;
  }

  removeComment(movieId, commentId) {
    const movie = this.getMovieById(movieId);

    if (movie === null) {
      return false;
    }

    const commentIndex = movie.comments.findIndex((it) => it.id === commentId);

    if (commentIndex === -1) {
      return false;
    }

    movie.comments = [].concat(movie.comments.slice(0, commentIndex), movie.comments.slice(commentIndex + 1));

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
