import AbstractComponent from './abstract-component.js';
import {getProfileRating} from '../utils/common.js';

const createProfileTemplate = (watchedMovies) => {
  const profileRating = getProfileRating(watchedMovies);

  return `<section class="header__profile profile">
    <p class="profile__rating">${profileRating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class Profile extends AbstractComponent {
  constructor(watchedMovies) {
    super();
    this._watchedMovies = watchedMovies;
  }

  getTemplate() {
    return createProfileTemplate(this._watchedMovies);
  }
}
