const MINUTE_IN_HOUR = 60;

const MIN_DESCRIPTION_LENGTH = 0;
const MAX_DESCRIPTION_LENGTH = 140;
const DESCRIPTION_SPACE = 1;

const MANY_COMMENTS_COUNT = 1;

const ONE_DAY = 86400000;

const getDuration = (duration) => {
  let formatedDuration = ``;

  if (duration < MINUTE_IN_HOUR) {
    formatedDuration += `${duration}m`;
  } else if (duration === MINUTE_IN_HOUR) {
    formatedDuration += `${duration}h`;
  } else {
    const hours = (duration / MINUTE_IN_HOUR).toFixed(0);
    const minutes = duration % MINUTE_IN_HOUR;
    formatedDuration += `${hours}h ${minutes}m`;
  }

  return formatedDuration;
};

const getDescription = (description) => {
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return `${description.substring(MIN_DESCRIPTION_LENGTH, (MAX_DESCRIPTION_LENGTH - DESCRIPTION_SPACE))}...`;
  }

  return description;
};

const getComments = (comments) => {
  const commentsCount = comments.length;

  return commentsCount > MANY_COMMENTS_COUNT ? `${commentsCount} comments` : `${commentsCount} comment`;
};

const getFormatedValue = (value) => {
  return value < 10 ? `0${value}` : value.toString();
};

const getDateValues = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = getFormatedValue(date.getHours());
  const minutes = getFormatedValue(date.getMinutes());

  return {year, month, day, hours, minutes};
};

export const getFormatedCommentDate = (date) => {
  const {year, month, day, hours, minutes} = getDateValues(date);

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const getFormatedDiffrenceDate = (date, currentDate) => {
  const differenceTimestamp = currentDate.valueOf() - date.valueOf();
  if (differenceTimestamp < ONE_DAY) {
    return `Today`;
  }

  const differenceDays = differenceTimestamp % ONE_DAY;
  if (differenceDays > 3) {
    return getFormatedCommentDate(date);
  }
  return (differenceDays > 1) ? `${differenceDays} days ago` : `${differenceDays} day ago`;

};

const sortMovies = (movies, key) => {
  const sorted = movies.slice().sort((prevMovie, nextMovie) => {
    if (prevMovie[key] > nextMovie[key]) {
      return -1;
    }
    if (prevMovie[key] < nextMovie[key]) {
      return 1;
    }
    return 0;
  });
  return sorted;
};

export {getDuration, getDescription, getComments, getFormatedDiffrenceDate, sortMovies};
