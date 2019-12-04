import {createMenuTemplate} from './components/menu.js';
import {createProfileTemplate} from './components/profile.js';
import {createButtontempalte} from './components/button.js';
import {createFimlsCardsTemplates} from './components/card.js';
import {createContentTemplate} from './components/content.js';
import {createSortTemplate} from './components/sort.js';
import {createStatsTemplate} from './components/footer.js';
import {createFilmDetailtemplate, removeFilmDetailTemplate} from './components/popup.js';
import {generateMovies} from './mock/movie.js';
import {generateFilters} from './mock/filter.js';
import {sortMovies} from './util.js';
const SHOWING_MOVIE_COUNT = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;
const COUNT_FILMS = 15;

const movies = generateMovies(COUNT_FILMS);
const filters = generateFilters(movies);
const watchedMovies = movies.filter((movie) => movie.isWatched).length;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);


render(headerElement, createProfileTemplate(watchedMovies));
render(mainElement, createMenuTemplate(filters));
render(mainElement, createSortTemplate());
render(mainElement, createContentTemplate());
render(footerElement, createStatsTemplate(COUNT_FILMS));

const filmsList = mainElement.querySelector(`.films-list .films-list__container`);
let showingMoviesCount = SHOWING_MOVIE_COUNT;
render(filmsList, createFimlsCardsTemplates(movies.slice(0, showingMoviesCount)));

render(filmsList, createButtontempalte(), `afterend`);

const filmListExtra = document.querySelectorAll(`.films-list--extra .films-list__container`);

const filmsTopRatedContainer = filmListExtra[0];
const filmsMostCommentedContainer = filmListExtra[1];

const topRatedFilms = movies.filter((movie) => movie.rating > 0);
const sortedTopRatedFilms = sortMovies(topRatedFilms, `rating`).slice(0, 2);

const topCommentedFilms = movies.filter((movie) => movie.comments.length > 0);
const sortedTopCommentedFilms = sortMovies(topCommentedFilms, `comments`).slice(0, 2);

render(filmsTopRatedContainer, createFimlsCardsTemplates(sortedTopRatedFilms));
render(filmsMostCommentedContainer, createFimlsCardsTemplates(sortedTopCommentedFilms));

const loadMoreButton = mainElement.querySelector(`.films-list__show-more`);
loadMoreButton.addEventListener(`click`, () => {
  const prevMoviesCount = showingMoviesCount;
  showingMoviesCount = showingMoviesCount + SHOWING_MOVIES_COUNT_BY_BUTTON;

  render(filmsList, createFimlsCardsTemplates(movies.slice(prevMoviesCount, showingMoviesCount)));

  if (showingMoviesCount >= movies.length) {
    loadMoreButton.remove();
  }
});

render(footerElement, createFilmDetailtemplate(movies[0]), `afterend`);

const closeButton = document.querySelector(`.film-details__close-btn`);
closeButton.addEventListener(`click`, () => {
  removeFilmDetailTemplate();
  closeButton.removeEventListener();
});
