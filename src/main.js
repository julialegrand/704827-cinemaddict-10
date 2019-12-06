import SiteMenuComponent from './components/menu.js';
import ProfileComponent from './components/profile.js';
import ButtonComponent from './components/button.js';
import CardComponent from './components/card.js';
import ContentComponent from './components/content.js';
import SortComponent from './components/sort.js';
import FooterComponent from './components/footer.js';
import PopupComponent from './components/popup.js';
import {generateMovies} from './mock/movie.js';
import {generateFilters} from './mock/filter.js';
import {sortMovies, RenderPosition, render} from './util.js';
const SHOWING_MOVIE_COUNT = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;
const COUNT_FILMS = 15;

const movies = generateMovies(COUNT_FILMS);
const filters = generateFilters(movies);
const watchedMovies = movies.filter((movie) => movie.isWatched).length;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);


render(headerElement, new ProfileComponent(watchedMovies).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new SiteMenuComponent(filters).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);
const content = new ContentComponent();
render(mainElement, content.getElement(), RenderPosition.BEFOREEND);
render(footerElement, new FooterComponent(COUNT_FILMS).getElement(), RenderPosition.BEFOREEND);

const filmsList = content.getElement().querySelector(`.films-list .films-list__container`);
let showingMoviesCount = SHOWING_MOVIE_COUNT;

const renderMovie = (movie, container) => {
  const cardElement = new CardComponent(movie);
  const cardPopapComponent = new PopupComponent(movie);

  const showPopup = () => {
    render(footerElement, cardPopapComponent.getElement(), RenderPosition.AFTERBEGIN);
    const closeCard = cardPopapComponent.getElement().querySelector(`.film-details .film-details__close-btn`);
    closeCard.addEventListener(`click`, () => {
      cardPopapComponent.getElement().remove();
      cardPopapComponent.removeElement();
    });
  };

  const posterCard = cardElement.getElement().querySelector(`.film-card .film-card__poster`);
  const titleCard = cardElement.getElement().querySelector(`.film-card .film-card__title`);
  const commentCard = cardElement.getElement().querySelector(`.film-card .film-card__comments`);
  posterCard.addEventListener(`click`, () => {
    showPopup();
  });
  titleCard.addEventListener(`click`, () => {
    showPopup();
  });
  commentCard.addEventListener(`click`, () => {
    showPopup();
  });

  render(container, cardElement.getElement(), RenderPosition.BEFOREEND);
};

movies.slice(0, showingMoviesCount)
.forEach((movie) => renderMovie(movie, filmsList));
const filmListExtra = content.getElement().querySelectorAll(`.films-list--extra .films-list__container`);

const button = content.getElement().querySelector(`.films-list`);

const filmsTopRatedContainer = filmListExtra[0];
const filmsMostCommentedContainer = filmListExtra[1];

const topRatedFilms = movies.filter((movie) => movie.rating > 0);
const sortedTopRatedFilms = sortMovies(topRatedFilms, `rating`).slice(0, 2);

const topCommentedFilms = movies.filter((movie) => movie.comments.length > 0);
const sortedTopCommentedFilms = sortMovies(topCommentedFilms, `comments`).slice(0, 2);

sortedTopRatedFilms.forEach((movie) => {
  renderMovie(movie, filmsTopRatedContainer);
});
sortedTopCommentedFilms.forEach((movie) => {
  renderMovie(movie, filmsMostCommentedContainer);
});
const buttonElement = new ButtonComponent();
render(button, buttonElement.getElement(), RenderPosition.BEFOREEND);
buttonElement.getElement().addEventListener(`click`, () => {
  const prevMoviesCount = showingMoviesCount;
  showingMoviesCount = showingMoviesCount + SHOWING_MOVIES_COUNT_BY_BUTTON;
  movies.slice(prevMoviesCount, showingMoviesCount)
  .forEach((movie) => render(filmsList, new CardComponent(movie).getElement(), RenderPosition.BEFOREEND));

  if (showingMoviesCount >= movies.length) {
    buttonElement.getElement().remove();
    buttonElement.removeElement();
  }
});


