import SiteMenuComponent from '../components/menu.js';
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
  constructor(movies, filters) {
    this._movies = movies;
    this._filters = filters;
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
  }

  getMovies() {
    switch (this._sortType) {
      case SortType.DEFAULT:
        return this._movies;
      case SortType.DATE:
        return sortMovies(this._movies, `year`);
      case SortType.RATING:
        return sortMovies(this._movies, `rating`);
      default: return this._movies;
    }
  }

  render() {
    const watchedMovies = this._movies.filter((movie) => movie.isWatched).length;

    const headerElement = document.querySelector(`.header`);
    const mainElement = document.querySelector(`.main`);
    const footerElement = document.querySelector(`.footer`);

    render(headerElement, new ProfileComponent(watchedMovies), RenderPosition.BEFOREEND);
    render(mainElement, new SiteMenuComponent(this._filters), RenderPosition.BEFOREEND);
    render(mainElement, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.renderSortFilters();

    if (this._movies.length === 0) {
      render(mainElement, this._noDataComponent, RenderPosition.BEFOREEND);
      return;
    }
    render(mainElement, this._contentComponent, RenderPosition.BEFOREEND);
    render(footerElement, new FooterComponent(COUNT_FILMS), RenderPosition.BEFOREEND);

    this._mainFilmList = this._contentComponent.getElement().querySelector(`.films-list .films-list__container`);

    const newMovies = renderMovies(this._movies.slice(0, this._showingMoviesCount), this._mainFilmList, this._dataChangeHandler, this._viewChangeHandler);
    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);

    const filmListExtra = this._contentComponent.getElement().querySelectorAll(`.films-list--extra .films-list__container`);
    const filmsTopRatedContainer = filmListExtra[0];
    const filmsMostCommentedContainer = filmListExtra[1];

    const topRatedFilms = this._movies.filter((movie) => movie.rating > 0);
    const sortedTopRatedFilms = sortMovies(topRatedFilms, `rating`).slice(0, SHOWING_MOVIE_COUNT_EXTRA_FILM);

    const topCommentedFilms = this._movies.filter((movie) => movie.comments.length > 0);
    const sortedTopCommentedFilms = sortMovies(topCommentedFilms, `comments`).slice(0, SHOWING_MOVIE_COUNT_EXTRA_FILM);

    renderMovies(sortedTopRatedFilms, filmsTopRatedContainer, this._dataChangeHandler, this._viewChangeHandler);
    renderMovies(sortedTopCommentedFilms, filmsMostCommentedContainer, this._dataChangeHandler, this._viewChangeHandler);

    this._renderLoadMoreButton();
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(sortType) {
    this._sortType = sortType;

    const filmListElement = this._mainFilmList;

    filmListElement.innerHTML = ``;
    this._showingMoviesCount = SHOWING_MOVIE_COUNT;
    const newMovies = renderMovies(this.getMovies().slice(0, this._showingMoviesCount), filmListElement, this._dataChangeHandler, this._viewChangeHandler);
    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    if (this._showingMoviesCount >= this.getMovies().length) {
      return;
    }

    const filmsContainer = this._contentComponent.getElement().querySelector(`.films-list`);

    render(filmsContainer, this._buttonComponent, RenderPosition.BEFOREEND);

    this._buttonComponent.setClickHandler(() => {
      const prevMoviesCount = this._showingMoviesCount;
      this._showingMoviesCount = this._showingMoviesCount + SHOWING_MOVIES_COUNT_BY_BUTTON;
      const newMovies = renderMovies(this.getMovies().slice(prevMoviesCount, this._showingMoviesCount), this._mainFilmList, this._dataChangeHandler, this._viewChangeHandler);
      this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
      if (this._showingMoviesCount >= this.getMovies().length) {
        remove(this._buttonComponent);
      }
    });
  }

  _dataChangeHandler(movieController, oldMovie, newMovie) {
    const index = this._movies.findIndex((it) => it === oldMovie);

    if (index === -1) {
      return;
    }

    this._movies = [...this._movies.slice(0, index), newMovie, ...this._movies.slice(index + 1)];

    movieController.render(this._movies[index]);
  }

  _viewChangeHandler() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }
}

