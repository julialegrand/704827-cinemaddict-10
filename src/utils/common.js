import moment from 'moment';
import {NOVICE_MIN, FAN_MIN, MOVIE_BUFF_MIN, ProfileRatings} from './const.js';

const MIN_DESCRIPTION_LENGTH = 0;
const MAX_DESCRIPTION_LENGTH = 140;
const DESCRIPTION_SPACE = 1;
const MANY_COMMENTS_COUNT = 1;
const ONE_DAY = 86400000;

export const getMovieDuration = (time) => {
  const timeInHours = moment.duration(time, `minutes`).hours();
  const timeInMinutes = moment.duration(time, `minutes`).minutes();
  return timeInHours !== 0 ? `${timeInHours}h ${timeInMinutes}m` : `${timeInMinutes}m`;
};

export const getProfileRating = (watchedMovies) => {
  let profileRating = ``;
  if (watchedMovies >= NOVICE_MIN) {
    profileRating = ProfileRatings.NOVICE;
  }
  if (watchedMovies >= FAN_MIN) {
    profileRating = ProfileRatings.FAN;
  }
  if (watchedMovies >= MOVIE_BUFF_MIN) {
    profileRating = ProfileRatings.MOVIE_BUFF;
  }
  return profileRating;
};

export const getDescription = (description) => {
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return `${description.substring(MIN_DESCRIPTION_LENGTH, (MAX_DESCRIPTION_LENGTH - DESCRIPTION_SPACE))}...`;
  }

  return description;
};

export const getComments = (comments) => {
  const commentsCount = comments.length;

  return commentsCount > MANY_COMMENTS_COUNT ? `${commentsCount} comments` : `${commentsCount} comment`;
};

export const getFormatedDiffrenceDate = (date, currentDate) => {
  const differenceTimestamp = currentDate.valueOf() - date.valueOf();
  if (differenceTimestamp < ONE_DAY) {
    return `Today`;
  }

  const differenceDays = differenceTimestamp % ONE_DAY;
  if (differenceDays > 3) {
    return formatDateComment(date);
  }
  return (differenceDays > 1) ? `${differenceDays} days ago` : `${differenceDays} day ago`;
};

export const formatDateMovie = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatDateComment = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:MM`);
};

export const sortMovies = (movies, key, desc = true) => {
  const sorted = movies.slice().sort((prevMovie, nextMovie) => {
    if (prevMovie[key] > nextMovie[key]) {
      return desc ? -1 : 1;
    }
    if (prevMovie[key] < nextMovie[key]) {
      return desc ? 1 : -1;
    }
    return 0;
  });
  return sorted;
};
