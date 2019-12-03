const profileRatings = {
  novice: `Novice`,
  fan: `Fan`,
  movieBuff: `Movie Buff`
};
export const createProfileTemplate = (watchedMovies) => {
  let profileRating = profileRatings.novice;
  if (watchedMovies > 3) {
    profileRating = profileRatings.fan;
  }
  if (watchedMovies > 6) {
    profileRating = profileRatings.movieBuff;
  }
  return `<section class="header__profile profile">
    <p class="profile__rating">${profileRating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
