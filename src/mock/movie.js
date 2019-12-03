
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const RANDOM_LIMIT = 0.5;
const MIN_NUMBER = 0;
const DESCRIPTION_MIN = 0;
const DESCRIPTION_MAX = 3;
const MIN_RATING_COUNT = 0;
const MAX_RATING_COUNT = 10;
const MIN_YEAR_MOVIE = 1970;
const MAX_YEAR_MOVIE = 2020;
const MIN_DURATION_COUNT = 40;
const MAX_DURATION_COUNT = 180;
const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 20;

const movieNames = [
  `Полярный экспресс`,
  `Джанго освобожденный`,
  `Судная ночь`,
  `Железная хватка`,
  `Дикие истории`,
  `Марсианин`,
  `В тени Луны`,
  `Ирландец`,
  `Невидимый гость`,
  `Стрингер`,
  `Joker`,
  `Опaсная игра Cлоун`,
  `Загадочное убийство`,
  `Тpеугольник`,
  `Не отпускай меня`];

const Posters = [
  `the-great-flamarion.jpg`,
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`
];

const Genres = [
  `Thriller`,
  `Action`,
  `Comedy`,
  `Horror`,
  `Fantasy`
];


const getRandomNumber = (min, max) => {
  return Math.floor((max - min) * Math.random());
};

const getRandomDecimal = (min, max) => {
  return ((max - min) * Math.random()).toFixed(1);
};

const getRandomBoolean = () => {
  return Math.random() > RANDOM_LIMIT;
};

const getRandomItem = (items) => {
  const index = getRandomNumber(MIN_NUMBER, items.length);
  return items[index];
};

const createRandomItems = (items, min, max) => {
  return items
    .filter(() => getRandomBoolean())
    .slice(min, max);
};

const generateMovie = () => {

  return {
    title: getRandomItem(movieNames),
    rating: getRandomDecimal(MIN_RATING_COUNT, MAX_RATING_COUNT),
    year: MIN_YEAR_MOVIE + getRandomNumber(MIN_YEAR_MOVIE, MAX_YEAR_MOVIE),
    duration: getRandomNumber(MIN_DURATION_COUNT, MAX_DURATION_COUNT),
    genre: getRandomItem(Genres),
    poster: getRandomItem(Posters),
    description: createRandomItems(DESCRIPTION.split(`.`), DESCRIPTION_MIN, DESCRIPTION_MAX).join(` `),
    comments: getRandomNumber(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT),
    isFavorite: getRandomBoolean(),
    IsWatched: getRandomBoolean()
  };
};

const generateMovies = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateMovie);
};


export {generateMovies};
