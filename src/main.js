import {createMenuTemplate} from './components/menu.js';
import {createProfileTemplate} from './components/profile.js';
import {createButtontempalte} from './components/button.js';
import {createFimlCardTemplate} from './components/card.js';
import {createContentTemplate} from './components/content.js';
import {createSortTemplate} from './components/sort.js';
// import {createFilmDetailtemplate} from './components/popap.js';
const COUNT_FILMS = 5;
const COUNT_EXTRA_FILMS = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const fullCard = (count, container, template) => {
  new Array(count)
  .fill(``)
  .forEach(
      () => render(container, template())
  );
};
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
// const footerElement = document.querySelector(`.footer`);


render(headerElement, createProfileTemplate());
render(mainElement, createMenuTemplate());
render(mainElement, createSortTemplate());
render(mainElement, createContentTemplate());

const filmsList = mainElement.querySelector(`.films-list .films-list__container`);

fullCard(COUNT_FILMS, filmsList, createFimlCardTemplate);

render(filmsList, createButtontempalte(), `afterend`);

const filmListExtra = document.querySelectorAll(`.films-list--extra .films-list__container`);

const filmsTopRatedContainer = filmListExtra[0];
const filmsMostCommentedContainer = filmListExtra[1];

fullCard(COUNT_EXTRA_FILMS, filmsTopRatedContainer, createFimlCardTemplate);
fullCard(COUNT_EXTRA_FILMS, filmsMostCommentedContainer, createFimlCardTemplate);

// render(footerElement, createFilmDetailtemplate, `afterend`);
