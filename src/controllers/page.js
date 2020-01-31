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
const SHOWING_MOVIE_COUNT_EXTRA_FILM = 2;

const renderMovies = (movies, container, dataChangeHandler, viewChangeHandler, commentDataChangeHandler) => {
  return movies.map((movie) => {
    const movieController = new MovieController(container, dataChangeHandler, viewChangeHandler, commentDataChangeHandler);
    movieController.render(movie);
    return movieController;
  });
};

export default class PageController {
  constructor(container, moviesModel, api) {
    this._container = container;
    this._api = api;
    this._moviesModel = moviesModel;
    this._sortType = SortType.DEFAULT;
    this._showedMovieControllers = [];
    this._showedTopRatedMovieControllers = [];
    this._showedMostCommentedMovieControllers = [];
    this._showingMoviesCount = SHOWING_MOVIE_COUNT;
    this._mainFilmList = null;
    this._filmListExtra = null;
    this._contentComponent = new ContentComponent();
    this._sortComponent = new SortComponent();
    this._noDataComponent = new NoDataComponent();
    this._buttonComponent = new ButtonComponent();

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._commentDataChangeHandler = this._commentDataChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._loadMoreButtonClickHandler = this._loadMoreButtonClickHandler.bind(this);

    this._moviesModel.setFilterChangeHandler(this._filterChangeHandler);
  }

  hide() {
    this._contentComponent.hide();
    this._sortComponent.hide();
  }

  show() {
    this._contentComponent.show();
    this._sortComponent.show();
  }

  render() {
    const movies = this._moviesModel.getMovies();
    const allMoviesLength = this._moviesModel.getMoviesAll().length;
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
    render(footerElement, new FooterComponent(allMoviesLength), RenderPosition.BEFOREEND);

    this._mainFilmList = this._contentComponent.getElement().querySelector(`.films-list .films-list__container`);

    this._renderMovies(movies.slice(0, this._showingMoviesCount));

    this._filmListExtra = this._contentComponent.getElement().querySelectorAll(`.films-list--extra .films-list__container`);

    this._renderTopRatedMovies();
    this._renderMostCommentedMovies();

    this._renderLoadMoreButton();
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  _renderMovies(movies) {
    const newMovies = renderMovies(movies, this._mainFilmList, this._dataChangeHandler, this._viewChangeHandler, this._commentDataChangeHandler);
    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
    this._showingMoviesCount = this._showedMovieControllers.length;
  }

  _renderTopRatedMovies() {
    const movies = this._moviesModel.getMovies();
    this._showedTopRatedMovieControllers = [];
    const filmsTopRatedContainer = this._filmListExtra[0];
    filmsTopRatedContainer.innerHTML = ``;
    const topRatedFilms = movies.filter((movie) => movie.rating > 0);
    const sortedTopRatedFilms = sortMovies(topRatedFilms, `rating`).slice(0, SHOWING_MOVIE_COUNT_EXTRA_FILM);
    const topRatedMovies = renderMovies(sortedTopRatedFilms, filmsTopRatedContainer, this._dataChangeHandler, this._viewChangeHandler, this._commentDataChangeHandler);
    this._showedTopRatedMovieControllers = this._showedTopRatedMovieControllers.concat(topRatedMovies);
  }

  _renderMostCommentedMovies() {
    const movies = this._moviesModel.getMovies();
    this._showedMostCommentedMovieControllers = [];
    const filmsMostCommentedContainer = this._filmListExtra[1];
    filmsMostCommentedContainer.innerHTML = ``;
    const mostCommentedFilms = movies.filter((movie) => movie.comments.length > 0);
    const sortedMostCommentedFilms = sortMovies(mostCommentedFilms, `comments`).slice(0, SHOWING_MOVIE_COUNT_EXTRA_FILM);
    const mostCommentedMovies = renderMovies(sortedMostCommentedFilms, filmsMostCommentedContainer, this._dataChangeHandler, this._viewChangeHandler, this._commentDataChangeHandler);
    this._showedMostCommentedMovieControllers = this._showedMostCommentedMovieControllers.concat(mostCommentedMovies);
  }

  _removeMovies() {
    this._mainFilmList.innerHTML = ``;
    this._showedMovieControllers = [];
  }

  _getMoviesBySortType(sortType) {
    let sortedMovies = [];
    const movies = this._moviesModel.getMovies();

    switch (sortType) {
      case SortType.DATE:
        sortedMovies = sortMovies(movies.slice(), `releaseDate`);
        break;
      case SortType.RATING:
        sortedMovies = sortMovies(movies.slice(), `rating`);
        break;
      case SortType.DEFAULT:
        sortedMovies = movies.slice(0);
        break;
    }
    return sortedMovies;
  }

  _sortTypeChangeHandler(sortType) {
    this._sortType = sortType;
    const movies = this._getMoviesBySortType(this._sortType);
    const sortedMovies = movies.slice(0, this._showingMoviesCount);

    this._removeMovies();
    this._renderMovies(sortedMovies);
    this._renderLoadMoreButton();
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
    const movies = this._getMoviesBySortType(this._sortType);

    this._showingMoviesCount = this._showingMoviesCount + SHOWING_MOVIES_COUNT_BY_BUTTON;
    this._renderMovies(movies.slice(prevMoviesCount, this._showingMoviesCount));

    if (this._showingMoviesCount >= movies.length) {
      remove(this._buttonComponent);
    }
  }

  _dataChangeHandler(movieController, oldMovie, newMovie) {
    this._api.updateMovie(oldMovie.id, newMovie)
    .then((updatedMovie) => {
      const isSuccess = this._moviesModel.updateMovie(oldMovie.id, updatedMovie);
      if (isSuccess) {
        movieController.render(updatedMovie);
        this._renderTopRatedMovies();
      }
    })
    .catch(() => {
      movieController.shakeUserRating();
    });
  }

  _commentDataChangeHandler(movieController, oldMovie, commentId, newComment) {
    if (!newComment) {
      this._api.deleteComment(commentId)
      .then(() => {
        const isSuccess = this._moviesModel.removeComment(oldMovie.id, commentId);
        if (isSuccess) {
          const updatedMovie = this._moviesModel.getMovieById(oldMovie.id);
          movieController.render(updatedMovie);
          this._renderMostCommentedMovies();
        }
      })
      .catch(() =>{
        movieController.shake(false, commentId);
      });
    } else {
      this._api.createComment(oldMovie.id, newComment)
      .then((updatedComments) => {
        const isSuccess = this._moviesModel.updateComments(oldMovie.id, updatedComments);
        if (isSuccess) {
          const updatedMovie = this._moviesModel.getMovieById(oldMovie.id);
          movieController.render(updatedMovie);
          this._renderMostCommentedMovies();
        }
      })
      .catch(() => {
        movieController.shake(true);
      });
    }
  }

  _viewChangeHandler() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
    this._showedMostCommentedMovieControllers.forEach((it) => it.setDefaultView());
    this._showedTopRatedMovieControllers.forEach((it) => it.setDefaultView());
  }

  _filterChangeHandler() {
    this._removeMovies();
    this._renderMovies(this._moviesModel.getMovies().slice(0, SHOWING_MOVIE_COUNT));
    this._renderLoadMoreButton();
  }
}

