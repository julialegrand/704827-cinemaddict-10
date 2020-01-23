import ProfileComponent from '../components/profile.js';
import ButtonComponent from '../components/button.js';
import ContentComponent from '../components/content.js';
import SortComponent, {SortType} from '../components/sort.js';
import FooterComponent from '../components/footer.js';
import NoDataComponent from '../components/no-data.js';
import {sortMovies} from '../utils/common.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import MovieController from './movie.js';

const SHOWING_MOVIE_COUNT = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;
const COUNT_FILMS = 15;
const SHOWING_MOVIE_COUNT_EXTRA_FILM = 2;

const renderMovies = (movies, container, dataChangeHandler, viewChangeHandler) => {
  return movies.map((movie) => {
    const movieController = new MovieController(container, dataChangeHandler, viewChangeHandler);
    movieController.render(movie);
    return movieController;
  });
};

export default class PageController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._sortType = SortType.DEFAULT;
    this._showedMovieControllers = [];
    this._showingMoviesCount = SHOWING_MOVIE_COUNT;
    this._mainFilmList = null;
    this._contentComponent = new ContentComponent();
    this._sortComponent = new SortComponent();
    this._noDataComponent = new NoDataComponent();
    this._buttonComponent = new ButtonComponent();
    this._footerComponent = new FooterComponent();

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._loadMoreButtonClickHandler = this._loadMoreButtonClickHandler.bind(this);

    this._moviesModel.setFilterChangeHandler(this._filterChangeHandler);
  }

  render() {
    const movies = this._moviesModel.getMovies();
    const watchedMovies = movies.filter((movie) => movie.isWatched).length;

    const headerElement = document.querySelector(`.header`);
    const footerElement = document.querySelector(`.footer`);

    render(headerElement, new ProfileComponent(watchedMovies), RenderPosition.BEFOREEND);
    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.renderSortFilters();

    if (movies.length === 0) {
      render(this._container, this._noDataComponent, RenderPosition.BEFOREEND);
      return;
    }
    render(this._container, this._contentComponent, RenderPosition.BEFOREEND);
    render(footerElement, new FooterComponent(COUNT_FILMS), RenderPosition.BEFOREEND);

    this._mainFilmList = this._contentComponent.getElement().querySelector(`.films-list .films-list__container`);

    this._renderMovies(movies.slice(0, this._showingMoviesCount));

    const filmListExtra = this._contentComponent.getElement().querySelectorAll(`.films-list--extra .films-list__container`);
    const filmsTopRatedContainer = filmListExtra[0];
    const filmsMostCommentedContainer = filmListExtra[1];

    const topRatedFilms = movies.filter((movie) => movie.rating > 0);
    const sortedTopRatedFilms = sortMovies(topRatedFilms, `rating`).slice(0, SHOWING_MOVIE_COUNT_EXTRA_FILM);

    const topCommentedFilms = movies.filter((movie) => movie.comments.length > 0);
    const sortedTopCommentedFilms = sortMovies(topCommentedFilms, `comments`).slice(0, SHOWING_MOVIE_COUNT_EXTRA_FILM);

    renderMovies(sortedTopRatedFilms, filmsTopRatedContainer, this._dataChangeHandler, this._viewChangeHandler);
    renderMovies(sortedTopCommentedFilms, filmsMostCommentedContainer, this._dataChangeHandler, this._viewChangeHandler);

    this._renderLoadMoreButton();
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  _renderMovies(movies) {
    const newMovies = renderMovies(movies, this._mainFilmList, this._dataChangeHandler, this._viewChangeHandler);
    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
    this._showingMoviesCount = this._showedMovieControllers.length;
  }

  _removeMovies() {
    this._mainFilmList.innerHTML = ``;
    this._showedMovieControllers = [];
  }

  _sortTypeChangeHandler(sortType) {
    let sortedMovies = [];
    const movies = this._moviesModel.getMovies();

    switch (sortType) {
      case SortType.DATE:
        sortedMovies = sortMovies(movies.slice(), `year`);
        break;
      case SortType.RATING:
        sortedMovies = sortMovies(movies.slice(), `rating`);
        break;
      case SortType.DEFAULT:
        sortedMovies = movies.slice(0, this._showingMoviesCount);
        break;
    }

    this._removeMovies();
    this._renderMovies(sortedMovies);

    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._buttonComponent);
    }
  }

  _renderLoadMoreButton() {
    remove(this._buttonComponent);
    if (this._showingMoviesCount >= this._moviesModel.getMovies().length) {
      return;
    }
    const filmsContainer = this._contentComponent.getElement().querySelector(`.films-list`);
    render(filmsContainer, this._buttonComponent, RenderPosition.BEFOREEND);
    this._buttonComponent.setClickHandler(this._loadMoreButtonClickHandler);
  }

  _loadMoreButtonClickHandler() {
    const prevMoviesCount = this._showingMoviesCount;
    const movies = this._moviesModel.getMovies();

    this._showingMoviesCount = this._showingMoviesCount + SHOWING_MOVIES_COUNT_BY_BUTTON;
    this._renderMovies(movies.slice(prevMoviesCount, this._showingMoviesCount));

    if (this._showingMoviesCount >= movies.length) {
      remove(this._buttonComponent);
    }
  }

  _dataChangeHandler(movieController, oldMovie, newMovie) {
    const isSuccess = this._moviesModel.updateMovie(oldMovie.id, newMovie);
    if (isSuccess) {
      movieController.render(newMovie);
    }
  }

  _viewChangeHandler() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }

  _filterChangeHandler() {
    this._removeMovies();
    this._renderMovies(this._moviesModel.getMovies().slice(0, SHOWING_MOVIE_COUNT));
    this._renderLoadMoreButton();
  }
}

