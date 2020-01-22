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
const MAX_COMMENTS_COUNT = 5;
const MIN_MOCK_COUNT = 0;
const MAX_MOCK_COUNT = 3;

const MOVIE_NAMES = [
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

const POSTERS = [
  `the-great-flamarion.jpg`,
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`
];

const GENRES = [
  `Thriller`,
  `Action`,
  `Comedy`,
  `Horror`,
  `Fantasy`
];

const ACTORS = [
  `Matt Damon`,
  `Brad Pitt`,
  `Angeline Jolie`,
  `Sharon Stone`,
  `Bradley Cooper`
];

const PEOPLE = [
  `John Doe`,
  `Anna Smith`,
  `Jessica Paul`,
  `Erich Von Stroheim`,
  `Mary Beth Hughes`,
  `Richard Weil`
];

const COUNTRIES = [
  `Russia`,
  `USA`,
  `Turkey`,
  `Italy`,
  `Germany`
];

const EMOTIONS = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
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

const getRandomDate = () => {
  const currentDate = new Date();
  const year = getRandomNumber(MIN_YEAR_MOVIE, MAX_YEAR_MOVIE);
  currentDate.setFullYear(year);

  return currentDate;
};

const getRandomItem = (items) => {
  const index = getRandomNumber(MIN_NUMBER, items.length);
  return items[index];
};

const getRandomItems = (items, min, max) => {
  return items
    .filter(getRandomBoolean)
    .slice(min, max);
};

const createComment = () => {
  return {
    text: getRandomItems(DESCRIPTION.split(`.`), MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT).join(` `),
    emotion: getRandomItem(EMOTIONS),
    author: getRandomItem(PEOPLE),
    commentDate: getRandomDate(),
  };
};

const createComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(createComment);
};

const generateMovie = () => {

  const inWatchlist = getRandomBoolean();
  const isFavorite = getRandomBoolean();
  const userRating = null;
  let isWatched = getRandomBoolean();

  if (inWatchlist) {
    isWatched = false;
  }

  const title = getRandomItem(MOVIE_NAMES);

  return {
    title,
    originalTitle: title,
    rating: parseFloat(getRandomDecimal(MIN_RATING_COUNT, MAX_RATING_COUNT)),
    userRating,
    director: getRandomItem(PEOPLE),
    writers: getRandomItems(PEOPLE, MIN_MOCK_COUNT, MAX_MOCK_COUNT),
    actors: getRandomItems(ACTORS, MIN_MOCK_COUNT, MAX_MOCK_COUNT),
    year: MIN_YEAR_MOVIE + getRandomNumber(MIN_YEAR_MOVIE, MAX_YEAR_MOVIE),
    duration: getRandomNumber(MIN_DURATION_COUNT, MAX_DURATION_COUNT),
    country: getRandomItem(COUNTRIES),
    genre: getRandomItems(GENRES, MIN_MOCK_COUNT, MAX_MOCK_COUNT),
    poster: getRandomItem(POSTERS),
    description: getRandomItems(DESCRIPTION.split(`.`), DESCRIPTION_MIN, DESCRIPTION_MAX).join(` `),
    comments: createComments(getRandomNumber(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT)),
    isFavorite,
    isWatched,
    inWatchlist
  };
};

const generateMovies = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateMovie);
};


export {generateMovies};
