import {createCommentsTemplate} from './comment.js';
import {getMovieDuration, formatDateMovie} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import Rating from './rating.js';
import {EmotionType} from '../utils/const.js';
import Comment from '../models/comment.js';

const createGenreMarkup = (genres) => {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`);
};

const createUserRatingMarkup = (userRating) => {
  return `<p class="film-details__user-rating">Your rate ${userRating}</p>`;
};

const createFilmControlMarkup = (name, id, isActive) => {
  const checked = isActive ? `checked` : ``;
  return (
    `<input type="checkbox" ${checked} class="film-details__control-input visually-hidden" id="${id}" name="${id}">
    <label for="${id}" class="film-details__control-label film-details__control-label--${id}">${name}</label>`
  );
};

const createMovieDetailtemplate = (movie, selectedEmotion) => {
  const {title, originalTitle, rating, userRating, director, writers, actors, releaseDate, runtime, country, genre,
    poster, description, comments, inWatchlist, isFavorite, isWatched} = movie;

  const watchlistCheckbox = createFilmControlMarkup(`Add to watchlist`, `watchlist`, inWatchlist);
  const watchedCheckbox = createFilmControlMarkup(`Already watched`, `watched`, isWatched);
  const favoriteCheckbox = createFilmControlMarkup(`Add to favorites`, `favorite`, isFavorite);

  const genresTemplate = createGenreMarkup(genre);
  const genresTitle = genre.length > 1 ? `Genres` : `Genre`;

  const userRatingTemplate = userRating ? createUserRatingMarkup(userRating) : ``;

  const commentsTemplate = createCommentsTemplate(comments);
  const commentsCount = comments.length;
  const formatedDuration = getMovieDuration(runtime);

  const isSelectedEmotion = (emotion) => {
    return selectedEmotion === emotion ? `checked` : ``;
  };

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">18+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${originalTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
                ${userRatingTemplate}
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${formatDateMovie(releaseDate)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formatedDuration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genresTitle}</td>
                <td class="film-details__cell">
                  ${genresTemplate}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          ${watchlistCheckbox}
          ${watchedCheckbox}
          ${favoriteCheckbox}
        </section>
      </div>

      <div class="form-details__middle-container">
      </div>

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

          ${commentsTemplate}

          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label">
            ${selectedEmotion ? `<img src="images/emoji/${selectedEmotion}.png" width="55" height="55" alt="emoji">` : ``}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden"  data-emotion-type="${EmotionType.SMILE}" ${isSelectedEmotion(EmotionType.SMILE)} name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" data-emotion-type="${EmotionType.SLEEPING}" ${isSelectedEmotion(EmotionType.SLEEPING)} name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" data-emotion-type="${EmotionType.PUKE}" ${isSelectedEmotion(EmotionType.PUKE)} name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
              <label class="film-details__emoji-label" for="emoji-gpuke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" data-emotion-type="${EmotionType.ANGRY}" ${isSelectedEmotion(EmotionType.ANGRY)} name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
</section>`
  );
};

export default class Popup extends AbstractSmartComponent {
  constructor(movie, movieController, dataChangeHandler) {
    super();
    this._movie = movie;
    this._movieController = movieController;
    this._dataChangeHandler = dataChangeHandler;
    this._ratingComponent = null;
    this._ratingContainer = null;
    this._currentEmotion = null;
    this._closeButtonClickHandler = null;
    this._addWatchlistClickHandler = null;
    this._markWatchedClickHandler = null;
    this._markFavoriteClickHandler = null;
    this._setCommentDeleteClickHandler = null;
    this._setAddCommmentHandler = null;
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setAddWatchlistClickHandler(this._addWatchlistClickHandler);
    this.setMarkWatchedClickHandler(this._markWatchedClickHandler);
    this.setMarkFavoriteClickHandler(this._markFavoriteClickHandler);
    this.setEmotionClickHandler();
    this.setCommentDeleteClickHandler(this._setCommentDeleteClickHandler);
    this.setAddCommmentHandler(this._setAddCommmentHandler);
  }

  getTemplate() {
    return createMovieDetailtemplate(this._movie, this._currentEmotion);
  }

  renderRating() {
    if (this._movie.isWatched) {
      this._ratingContainer = this._element.querySelector(`.form-details__middle-container`);
      this._ratingComponent = new Rating(this._movie);
      this._ratingContainer.appendChild(this._ratingComponent.getElement());
      this._ratingComponent.setInputChangeHandler((evt) => {
        const rating = parseInt(evt.target.value, 10);
        this._dataChangeHandler(this._movieController, this._movie, Object.assign({}, this._movie, {
          userRating: rating,
        }));
      });
      this._ratingComponent.setUndoInputChangeHandler(() => {
        this._dataChangeHandler(this._movieController, this._movie, Object.assign({}, this._movie, {
          userRating: null,
        }));
      });
    } else if (this._ratingComponent !== null) {
      this._ratingComponent.removeElement();
      this._ratingComponent = null;
      this._ratingContainer = null;
    }
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);
    this._closeButtonClickHandler = handler;
  }

  setAddWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, handler);
    this._addWatchlistClickHandler = handler;
  }

  setMarkWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, handler);
    this._markWatchedClickHandler = handler;
  }

  setMarkFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, handler);
    this._markFavoriteClickHandler = handler;
  }

  setCommentDeleteClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `BUTTON`) {
        return;
      }
      const commentId = evt.target.value;
      this._setCommentDeleteClickHandler = handler;
      handler(commentId);
    });
  }

  setAddCommmentHandler(handler) {
    this._setAddCommmentHandler = handler;
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, (evt) => {
      if (evt.ctrlKey && evt.key === `Enter`) {
        if (this._currentEmotion === null) {
          return;
        }

        const commentText = evt.target.value;
        const newComment = new Comment({
          id: new Date().valueOf().toString(),
          comment: commentText,
          emotion: this._currentEmotion !== null ? this._currentEmotion : null,
          date: new Date().toISOString(),
          author: `author`
        });
        handler(newComment);
      }
    });
  }

  setEmotionClickHandler() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      const emotionType = evt.target.dataset.emotionType;
      if (this._currentEmotion === emotionType) {
        return;
      }

      this._currentEmotion = emotionType;
      this.rerender();
    });
  }
}
