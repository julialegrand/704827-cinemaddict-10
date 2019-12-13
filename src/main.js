import PageController from './controllers/page.js';
import {generateMovies} from './mock/movie.js';
import {generateFilters} from './mock/filter.js';

const COUNT_FILMS = 15;

const movies = generateMovies(COUNT_FILMS);
const filters = generateFilters(movies);

const mainController = new PageController(movies, filters);

mainController.render();
