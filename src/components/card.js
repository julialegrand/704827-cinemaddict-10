
import {getDuration, getDescription, getComments} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const createButtonMarkup = (name, className, isActive) => {
  const activeClass = isActive ? `film-card__controls-item--active` : ``;
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${className} ${activeClass}">
      ${name}
    </button>`);
};

const createFilmCardTemplate = (movie) => {

  const {title, rating, year, duration, genre, poster, description, comments, inWatchlist, isFavorite, isWatched} = movie;

  const formatedDuration = getDuration(duration);
  const formatedDescription = getDescription(description);
  const formatedComments = getComments(comments);

  const watchlistButton = createButtonMarkup(`Add to watchlist`, `add-to-watchlist`, inWatchlist);
  const watchedButton = createButtonMarkup(`Mark as watched`, `mark-as-watched`, isWatched);
  const favoriteButton = createButtonMarkup(`Mark as favorite`, `favorite`, isFavorite);

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
    <span class="film-card__year">${year}</span>
    <span class="film-card__duration">${formatedDuration}</span>
    <span class="film-card__genre">${genre}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${formatedDescription}</p>
  <a class="film-card__comments">${formatedComments}</a>
    <form class="film-card__controls">
      ${watchlistButton}
      ${watchedButton}
      ${favoriteButton}
    </form>
  </article>`;
};


export default class Card extends AbstractComponent {
  constructor(movie) {
    super();
    this._movie = movie;
    this._clickHandler = null;
    this._keyPressHandler = null;
    this._addWatchlistClickHandler = null;
    this._markWatchedClickHandler = null;
    this._markFavoriteClickHandler = null;
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this.setClickHandler(this._clickHandler);
    this.setKeyPressHandler(this._keyPressHandler);
    this.setAddWatchlistClickHandler(this._addWatchlistClickHandler);
    this.setMarkWatchedClickHandler(this._markWatchedClickHandler);
    this.setMarkFavoriteClickHandler(this._markFavoriteClickHandler);
  }

  getTemplate() {
    return createFilmCardTemplate(this._movie);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
    this._clickHandler = handler;
  }

  setKeyPressHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`keydown`, handler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`keydown`, handler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`keydown`, handler);
    this._keyPressHandler = handler;
  }

  setAddWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
    this._addWatchlistClickHandler = handler;
  }

  setMarkWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
    this._markWatchedClickHandler = handler;
  }

  setMarkFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
    this._markFavoriteClickHandler = handler;
  }
}
