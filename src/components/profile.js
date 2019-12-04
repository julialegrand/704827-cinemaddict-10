const ProfileRatings = {
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`
};
const NOVICE_MIN = 1;
const FAN_MIN = 11;
const MOVIE_BUFF_MIN = 21;

export const createProfileTemplate = (watchedMovies) => {
  let profileRating = ``;
  if (watchedMovies >= NOVICE_MIN) {
    profileRating = ProfileRatings.NOVICE;
  }
  if (watchedMovies >= FAN_MIN) {
    profileRating = ProfileRatings.FAN;
  }
  if (watchedMovies >= MOVIE_BUFF_MIN) {
    profileRating = ProfileRatings.MOVIE_BUFF;
  }
  return `<section class="header__profile profile">
    <p class="profile__rating">${profileRating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
