import moment from 'moment';
import numberToWords from 'number-to-words';
import {NOVICE_MIN, FAN_MIN, MOVIE_BUFF_MIN, ProfileRatings} from './const.js';

const MIN_DESCRIPTION_LENGTH = 0;
const MAX_DESCRIPTION_LENGTH = 140;
const DESCRIPTION_SPACE = 1;
const MANY_COMMENTS_COUNT = 1;

const MINUTE_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;

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
  const differenceTimestamp = currentDate - new Date(date);

  const daysCount = getDays(differenceTimestamp);
  const hoursCount = getHours(differenceTimestamp);
  const minutesCount = getMinutes(differenceTimestamp);
  const secondCount = getSeconds(differenceTimestamp);

  let formatedDate = ``;

  if (daysCount > 1) {
    const daysCountText = numberToWords.toWords(daysCount);
    formatedDate = `a ${daysCountText.toLowerCase()} days ago`;
  } else if (daysCount === 1) {
    formatedDate = `a day ago`;
  } else if (hoursCount >= 2 && hoursCount <= 23 && minutesCount >= 0 && minutesCount <= 59) {
    formatedDate = `a few hours ago`;
  } else if (hoursCount === 1 && minutesCount >= 0 && minutesCount <= 59) {
    formatedDate = `a hour ago`;
  } else if (minutesCount >= 4 && minutesCount <= 59) {
    formatedDate = ` a few minutes ago`;
  } else if (minutesCount >= 1 && minutesCount <= 3) {
    formatedDate = `a minute ago`;
  } else if (secondCount >= 0 && secondCount <= 59) {
    formatedDate = `now`;
  }
  return formatedDate;
};

const getDays = (timestamp) => {
  return moment.duration(timestamp, `milliseconds`).days();
};

const getHours = (timestamp) => {
  return moment.duration(timestamp, `milliseconds`).hours();
};

const getMinutes = (timestamp) => {
  const minutes = moment.duration(timestamp, `milliseconds`).minutes();
  if (minutes > MINUTE_IN_HOUR) {
    const hours = getHours(timestamp);
    return minutes - (hours * MINUTE_IN_HOUR);
  }
  return minutes;
};

const getSeconds = (timestamp) => {
  const seconds = moment.duration(timestamp, `milliseconds`).seconds();
  if (seconds > SECONDS_IN_MINUTE) {
    const minutes = getMinutes(timestamp);
    return seconds - (minutes * SECONDS_IN_MINUTE);
  }
  return seconds;
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
