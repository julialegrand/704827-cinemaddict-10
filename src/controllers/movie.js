import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import {MovieControllerMode} from '../utils/const.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';

export default class MovieController {
  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._cardComponent = null;
    this._cardPopupComponent = null;
    this._movie = null;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;

    this._mode = MovieControllerMode.DEFAULT;

    this._showPopup = this._showPopup.bind(this);
    this._showPopupKeyPressHandler = this._showPopupKeyPressHandler.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._closePopupKeyPressHandler = this._closePopupKeyPressHandler.bind(this);

    this._addWatchlistClickHandler = this._addWatchlistClickHandler.bind(this);
    this._markWatchedClickHandler = this._markWatchedClickHandler.bind(this);
    this._markFavoriteClickHandler = this._markFavoriteClickHandler.bind(this);
  }

  render(movie) {
    this._movie = movie;
    const oldCardComponent = this._cardComponent;
    const oldCardPopupComponent = this._cardPopupComponent;

    this._cardComponent = this._getCardComponent(this._movie);
    this._cardPopupComponent = this._getCardPopupComponent(this._movie);

    if (oldCardComponent && oldCardPopupComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._cardPopupComponent, oldCardPopupComponent);
      this._cardPopupComponent.renderRating();
    } else {
      render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    }
  }

  _getCardPopupComponent(movie) {
    const cardPopupComponent = new PopupComponent(movie, this, this._dataChangeHandler);
    cardPopupComponent.setCloseButtonClickHandler(this._closePopup);
    cardPopupComponent.setAddWatchlistClickHandler(this._addWatchlistClickHandler);
    cardPopupComponent.setMarkWatchedClickHandler(this._markWatchedClickHandler);
    cardPopupComponent.setMarkFavoriteClickHandler(this._markFavoriteClickHandler);
    return cardPopupComponent;
  }

  _getCardComponent(movie) {
    const cardComponent = new CardComponent(movie);
    cardComponent.setClickHandler(this._showPopup);
    cardComponent.setKeyPressHandler(this._showPopupKeyPressHandler);
    cardComponent.setAddWatchlistClickHandler(this._addWatchlistClickHandler);
    cardComponent.setMarkWatchedClickHandler(this._markWatchedClickHandler);
    cardComponent.setMarkFavoriteClickHandler(this._markFavoriteClickHandler);
    return cardComponent;
  }

  _addWatchlistClickHandler() {
    const inWatchlist = !this._movie.inWatchlist;
    let isWatched = this._movie.isWatched;
    if (inWatchlist) {
      isWatched = false;
    }
    this._dataChangeHandler(this, this._movie, Object.assign({}, this._movie, {
      inWatchlist,
      isWatched,
    }));
  }

  _markWatchedClickHandler() {
    const isWatched = !this._movie.isWatched;
    let inWatchlist = this._movie.inWatchlist;
    let userRating = this._movie.userRating;
    if (isWatched) {
      inWatchlist = false;
    } else {
      userRating = null;
    }
    this._dataChangeHandler(this, this._movie, Object.assign({}, this._movie, {
      inWatchlist,
      isWatched,
      userRating
    }));
  }

  _markFavoriteClickHandler() {
    this._dataChangeHandler(this, this._movie, Object.assign({}, this._movie, {
      isFavorite: !this._movie.isFavorite,
    }));
  }

  _showPopup() {
    if (this._mode === MovieControllerMode.DEFAULT) {
      this._cardPopupComponent = this._getCardPopupComponent(this._movie);
      const footerElement = document.querySelector(`.footer`);
      render(footerElement, this._cardPopupComponent, RenderPosition.AFTERBEGIN);
      this._viewChangeHandler();
      document.addEventListener(`keydown`, this._closePopupKeyPressHandler);
      this._cardPopupComponent.renderRating();
      this._mode = MovieControllerMode.DETAIL;
    }
  }

  _showPopupKeyPressHandler(evt) {
    const isEnter = evt.key === `Enter`;

    if (isEnter) {
      this._showPopup();
    }
  }

  _closePopup() {
    if (this._cardPopupComponent) {
      remove(this._cardPopupComponent);
      this._cardPopupComponent = null;
      this._mode = MovieControllerMode.DEFAULT;
    }
  }

  _closePopupKeyPressHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
    }
  }

  setDefaultView() {
    if (this._mode !== MovieControllerMode.DEFAULT) {
      this._closePopup();
    }
  }
}
