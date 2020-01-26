import AbstractComponent from './abstract-component.js';
import {RATING_MIN_VALUE, RATING_MAX_VALUE, RATING_STEP} from '../utils/const.js';

const createRatingMarkup = (selectedValue) => {
  let ratingMarkup = ``;
  for (let i = RATING_MIN_VALUE; i <= RATING_MAX_VALUE; i += RATING_STEP) {
    const checked = i === selectedValue ? `checked` : ``;
    ratingMarkup += `
      <input type="radio" ${checked} name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}">
      <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`;
  }
  return ratingMarkup;
};

const createRatingTemplate = (movie) => {
  const {title, userRating, poster} = movie;
  const ratingMarkup = createRatingMarkup(userRating);
  return (
    `<section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              ${ratingMarkup}
            </div>
          </section>
        </div>
      </section>`
  );
};

export default class Rating extends AbstractComponent {
  constructor(movie) {
    super();
    this._movie = movie;
  }

  getTemplate() {
    return createRatingTemplate(this._movie);
  }

  setInputChangeHandler(handler) {
    this.getElement().querySelector(`.film-details__user-rating-score`)
      .addEventListener(`change`, handler);
  }

  setUndoInputChangeHandler(handler) {
    this.getElement().querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, handler);
  }
}
