import SiteMenuComponent from '../components/menu.js';
import ProfileComponent from '../components/profile.js';
import ButtonComponent from '../components/button.js';
import ContentComponent from '../components/content.js';
import SortComponent, {SortType} from '../components/sort.js';
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
  const cardPopupComponent = new PopupComponent(movie);

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closePopup();
    }
  };
  const closePopup = () => {
    remove(cardPopupComponent);
  };
  const showPopup = () => {
    render(footerElement, cardPopupComponent, RenderPosition.AFTERBEGIN);
    cardPopupComponent.setEditPopupClickHandler(() => {
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

const renderMovies = (movies, container, footerElement) => {
  movies.forEach((movie) => {
    renderMovie(movie, container, footerElement);
  });
};

export default class PageController {
  constructor(movies, filters) {
    this._movies = movies;
    this._filters = filters;
    this._sortType = SortType.DEFAULT;
    this._sortComponent = new SortComponent();
    this._noDataComponent = new NoDataComponent();
    this._buttonComponent = new ButtonComponent();
    this._footerComponent = new FooterComponent();
  }

  getMovies() {
    switch (this._sortType) {
      case SortType.DEFAULT:
        return this._movies;
      case SortType.DATE:
        return sortMovies(this._movies, `year`);
      case SortType.RATING:
        return sortMovies(this._movies, `rating`);
      default: return this._movies;
    }
  }

  render() {
    const renderLoadMoreButton = () => {
      if (showingMoviesCount >= this.getMovies().length) {
        return;
      }

      render(filmsContainer, this._buttonComponent, RenderPosition.BEFOREEND);

      this._buttonComponent.setClickHandler(() => {
        const prevMoviesCount = showingMoviesCount;
        showingMoviesCount = showingMoviesCount + SHOWING_MOVIES_COUNT_BY_BUTTON;
        renderMovies(this.getMovies().slice(prevMoviesCount, showingMoviesCount), filmsList, footerElement);

        if (showingMoviesCount >= this.getMovies().length) {
          remove(this._buttonComponent);
        }
      });
    };
    const watchedMovies = this._movies.filter((movie) => movie.isWatched).length;

    const headerElement = document.querySelector(`.header`);
    const mainElement = document.querySelector(`.main`);
    const footerElement = document.querySelector(`.footer`);

    render(headerElement, new ProfileComponent(watchedMovies), RenderPosition.BEFOREEND);
    render(mainElement, new SiteMenuComponent(this._filters), RenderPosition.BEFOREEND);
    render(mainElement, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.renderSortFilters();
    const content = new ContentComponent();
    const filmsContainer = content.getElement().querySelector(`.films-list`);

    if (this._movies.length === 0) {
      render(mainElement, this._noDataComponent, RenderPosition.BEFOREEND);
      return;
    }
    render(mainElement, content, RenderPosition.BEFOREEND);
    render(footerElement, new FooterComponent(COUNT_FILMS), RenderPosition.BEFOREEND);

    const filmsList = content.getElement().querySelector(`.films-list .films-list__container`);
    let showingMoviesCount = SHOWING_MOVIE_COUNT;

    renderMovies(this._movies.slice(0, showingMoviesCount), filmsList, footerElement);

    const filmListExtra = content.getElement().querySelectorAll(`.films-list--extra .films-list__container`);
    const filmsTopRatedContainer = filmListExtra[0];
    const filmsMostCommentedContainer = filmListExtra[1];

    const topRatedFilms = this._movies.filter((movie) => movie.rating > 0);
    const sortedTopRatedFilms = sortMovies(topRatedFilms, `rating`).slice(0, 2);

    const topCommentedFilms = this._movies.filter((movie) => movie.comments.length > 0);
    const sortedTopCommentedFilms = sortMovies(topCommentedFilms, `comments`).slice(0, 2);

    renderMovies(sortedTopRatedFilms, filmsTopRatedContainer, footerElement);
    renderMovies(sortedTopCommentedFilms, filmsMostCommentedContainer, footerElement);

    renderLoadMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      this._sortType = sortType;

      filmsList.innerHTML = ``;
      showingMoviesCount = SHOWING_MOVIE_COUNT;
      renderMovies(this.getMovies().slice(0, showingMoviesCount), filmsList, footerElement);

      renderLoadMoreButton();
    });
  }
}

