import SiteMenuComponent from '../components/menu.js';
import ProfileComponent from '../components/profile.js';
import ButtonComponent from '../components/button.js';
import ContentComponent from '../components/content.js';
import SortComponent from '../components/sort.js';
import FooterComponent from '../components/footer.js';
import NoDataComponent from '../components/no-data.js';
import {sortMovies} from '../utils/common.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import CardComponent from '../components/card.js';
import PopupComponent from '../components/popup.js';

const SHOWING_MOVIE_COUNT = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;
const COUNT_FILMS = 15;

const renderMovie = (movie, container, footerElement) => {
  const cardElement = new CardComponent(movie);
  const cardPopapComponent = new PopupComponent(movie);

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closePopup();
    }
  };
  const closePopup = () => {
    remove(cardPopapComponent);
  };
  const showPopup = () => {
    render(footerElement, cardPopapComponent, RenderPosition.AFTERBEGIN);
    cardPopapComponent.setEditPopupClickHandler(() => {
      closePopup();
    });
    document.addEventListener(`keydown`, onEscKeyDown);
  };
  cardElement.setEditPosterClickHandler(() => {
    showPopup();
  });
  cardElement.setEditTitleClickHandler(() => {
    showPopup();
  });
  cardElement.setEditCommentClickHandler(() => {
    showPopup();
  });

  render(container, cardElement, RenderPosition.BEFOREEND);
};


export default class PageController {
  constructor(container) {
    this._container = container;
    this._siteMenuComponent = new SiteMenuComponent();
    this._sortComponent = new SortComponent();
    this._noDataComponent = new NoDataComponent();
    this._buttonComponent = new ButtonComponent();
    this._profileComponent = new ProfileComponent();
    this._footerComponent = new FooterComponent();
  }

  render(movies, filters) {
    const watchedMovies = movies.filter((movie) => movie.isWatched).length;

    const headerElement = document.querySelector(`.header`);
    const mainElement = document.querySelector(`.main`);
    const footerElement = document.querySelector(`.footer`);


    render(headerElement, new ProfileComponent(watchedMovies), RenderPosition.BEFOREEND);
    render(mainElement, new SiteMenuComponent(filters), RenderPosition.BEFOREEND);
    render(mainElement, new SortComponent(), RenderPosition.BEFOREEND);
    const content = new ContentComponent();
    if (movies.length === 0) {
      render(mainElement, new NoDataComponent(), RenderPosition.BEFOREEND);
    } else {
      render(mainElement, content, RenderPosition.BEFOREEND);
      render(footerElement, new FooterComponent(COUNT_FILMS), RenderPosition.BEFOREEND);

      const filmsList = content.getElement().querySelector(`.films-list .films-list__container`);
      let showingMoviesCount = SHOWING_MOVIE_COUNT;

      movies.slice(0, showingMoviesCount)
      .forEach((movie) => renderMovie(movie, filmsList, footerElement));

      const filmListExtra = content.getElement().querySelectorAll(`.films-list--extra .films-list__container`);

      const button = content.getElement().querySelector(`.films-list`);

      const filmsTopRatedContainer = filmListExtra[0];
      const filmsMostCommentedContainer = filmListExtra[1];

      const topRatedFilms = movies.filter((movie) => movie.rating > 0);
      const sortedTopRatedFilms = sortMovies(topRatedFilms, `rating`).slice(0, 2);

      const topCommentedFilms = movies.filter((movie) => movie.comments.length > 0);
      const sortedTopCommentedFilms = sortMovies(topCommentedFilms, `comments`).slice(0, 2);

      sortedTopRatedFilms.forEach((movie) => {
        renderMovie(movie, filmsTopRatedContainer, footerElement);
      });
      sortedTopCommentedFilms.forEach((movie) => {
        renderMovie(movie, filmsMostCommentedContainer, footerElement);
      });

      const buttonElement = new ButtonComponent();
      render(button, buttonElement, RenderPosition.BEFOREEND);
      buttonElement.setClickHandler(() => {
        const prevMoviesCount = showingMoviesCount;
        showingMoviesCount = showingMoviesCount + SHOWING_MOVIES_COUNT_BY_BUTTON;
        movies.slice(prevMoviesCount, showingMoviesCount)
        .forEach((movie) => renderMovie(movie, filmsList, footerElement));

        if (showingMoviesCount >= movies.length) {
          remove(buttonElement);
        }
      });
    }
  }
}

