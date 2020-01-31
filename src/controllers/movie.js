import moment from 'moment';
import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';
import {MovieControllerMode} from '../utils/const.js';
import MovieModel from '../models/movie.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;
const USER_ZERO_RATING = 0;

export default class MovieController {
  constructor(container, dataChangeHandler, viewChangeHandler, commentDataChangeHandler) {
    this._container = container;
    this._cardComponent = null;
    this._cardPopupComponent = null;
    this._movie = null;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._commentDataChangeHandler = commentDataChangeHandler;

    this._mode = MovieControllerMode.DEFAULT;

    this._showPopup = this._showPopup.bind(this);
    this._showPopupKeyPressHandler = this._showPopupKeyPressHandler.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._closePopupKeyPressHandler = this._closePopupKeyPressHandler.bind(this);

    this._addWatchlistClickHandler = this._addWatchlistClickHandler.bind(this);
    this._markWatchedClickHandler = this._markWatchedClickHandler.bind(this);
    this._markFavoriteClickHandler = this._markFavoriteClickHandler.bind(this);
    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
    this._addCommentHandler = this._addCommentHandler.bind(this);
    this._ratingInputChangeHandler = this._ratingInputChangeHandler.bind(this);
    this._undoRatingHandler = this._undoRatingHandler.bind(this);
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
    } else {
      render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== MovieControllerMode.DEFAULT) {
      this._closePopup();
    }
  }

  shake(isCreating, commentId) {
    this._cardPopupComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    if (isCreating) {
      this._cardPopupComponent.setBackgroundCommentInput();
    }
    setTimeout(() => {
      this._cardPopupComponent.getElement().style.animation = ``;
      if (isCreating) {
        this._cardPopupComponent.setDefaultCommentInput();
      } else {
        this._cardPopupComponent.setDefaultDeleteButton(commentId);
      }

    }, SHAKE_ANIMATION_TIMEOUT);
  }

  shakeUserRating() {
    this._cardPopupComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._cardPopupComponent.setBackgroundUserRatingInput();
    setTimeout(() => {
      this._cardPopupComponent.getElement().style.animation = ``;
      this._cardPopupComponent.setDefaultUserRatingInput();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _getCardPopupComponent(movie) {
    const cardPopupComponent = new PopupComponent(movie, this, this._dataChangeHandler);
    cardPopupComponent.setCloseButtonClickHandler(this._closePopup);
    cardPopupComponent.setAddWatchlistClickHandler(this._addWatchlistClickHandler);
    cardPopupComponent.setMarkWatchedClickHandler(this._markWatchedClickHandler);
    cardPopupComponent.setMarkFavoriteClickHandler(this._markFavoriteClickHandler);
    cardPopupComponent.setEmotionClickHandler();
    cardPopupComponent.setCommentDeleteClickHandler(this._commentDeleteClickHandler);
    cardPopupComponent.setAddCommmentHandler(this._addCommentHandler);
    cardPopupComponent.setRatingInputChangeHandler(this._ratingInputChangeHandler);
    cardPopupComponent.setUndoRatingHandler(this._undoRatingHandler);
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
    const updatedMovie = MovieModel.clone(this._movie);
    updatedMovie.inWatchlist = !updatedMovie.inWatchlist;
    this._dataChangeHandler(this, this._movie, updatedMovie);
  }

  _markWatchedClickHandler() {
    const updatedMovie = MovieModel.clone(this._movie);
    updatedMovie.isWatched = !updatedMovie.isWatched;
    updatedMovie.userRating = 0;
    updatedMovie.watchingDate = moment().format();
    this._dataChangeHandler(this, this._movie, updatedMovie);
  }

  _markFavoriteClickHandler() {
    const updatedMovie = MovieModel.clone(this._movie);
    updatedMovie.isFavorite = !updatedMovie.isFavorite;
    this._dataChangeHandler(this, this._movie, updatedMovie);
  }

  _commentDeleteClickHandler(commentId) {
    this._cardPopupComponent.setDisabledDeleteButton(commentId);
    this._commentDataChangeHandler(this, this._movie, commentId, null);
  }

  _addCommentHandler(newComment) {
    this._cardPopupComponent.setDisabledCommentInput();
    this._cardPopupComponent.removeBackgroundCommentInput();
    this._commentDataChangeHandler(this, this._movie, null, newComment);
  }

  _ratingInputChangeHandler(newRating) {
    const updatedMovie = MovieModel.clone(this._movie);
    updatedMovie.userRating = newRating;
    this._cardPopupComponent.setDisabledUserRatingInputs();
    this._dataChangeHandler(this, this._movie, updatedMovie);
  }

  _undoRatingHandler() {
    const updatedMovie = MovieModel.clone(this._movie);
    updatedMovie.userRating = USER_ZERO_RATING;
    this._dataChangeHandler(this, this._movie, updatedMovie);
  }

  _showPopup() {
    if (this._mode === MovieControllerMode.DEFAULT) {
      this._cardPopupComponent = this._getCardPopupComponent(this._movie);
      const footerElement = document.querySelector(`.footer`);
      render(footerElement, this._cardPopupComponent, RenderPosition.AFTERBEGIN);
      this._viewChangeHandler();
      document.addEventListener(`keydown`, this._closePopupKeyPressHandler);
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
}
