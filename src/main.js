import PageController from './controllers/page.js';
import FilterController from './controllers/filter';
import {generateMovies} from './mock/movie.js';
import MoviesModel from './models/movies.js';

const COUNT_FILMS = 15;

const movies = generateMovies(COUNT_FILMS);
const moviesModel = new MoviesModel();
moviesModel.setMovies(movies);

const mainElement = document.querySelector(`.main`);

const filterController = new FilterController(mainElement, moviesModel);
const mainController = new PageController(mainElement, moviesModel);

filterController.render();
mainController.render();
