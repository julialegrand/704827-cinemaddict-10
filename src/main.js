import API from './api.js';
import PageController from './controllers/page.js';
import FilterController from './controllers/filter';
import StatisticsComponent from './components/statistics.js';
import MoviesModel from './models/movies.js';
import {render, RenderPosition} from './utils/render.js';

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

const moviesModel = new MoviesModel();

const api = new API(END_POINT, AUTHORIZATION);
const mainElement = document.querySelector(`.main`);

const statisticsComponent = new StatisticsComponent(moviesModel);
const filterController = new FilterController(mainElement, moviesModel);
const pageController = new PageController(mainElement, moviesModel);

const menuChangeHandler = (isStatsActive) => {
  if (isStatsActive) {
    statisticsComponent.show();
    pageController.hide();
  } else {
    statisticsComponent.hide();
    pageController.show();
  }
};

api.getMovies()
  .then((movies) => {
    const commentsPromise = movies.map((movie) => {
      return api.getComments(movie.id).then((comments) => {
        movie.comments = comments;
      });
    });
    Promise.all(commentsPromise).then(() => {
      moviesModel.setMovies(movies);
      filterController.setMenuChangeHandler(menuChangeHandler);
      filterController.render();
      pageController.render();
      render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);
      statisticsComponent.hide();
    });
  });


