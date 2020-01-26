import moment from 'moment';
import Chart from 'chart.js';
import ChartDatalabels from 'chartjs-plugin-datalabels';
import AbstractSmartComponent from './abstract-smart-component.js';
import {StatisticsFilter} from '../utils/const.js';
import {getProfileRating} from '../utils/common.js';

const getMoviesByDateRange = (movies, dateFrom, dateTo) => {
  return movies.filter((movie) => {
    const watchingDate = movie.watchingDate;
    return watchingDate >= dateFrom && watchingDate <= dateTo;
  });
};

const getMovieTotalDuration = (watchedMovies) => {
  let duration = 0;
  watchedMovies.forEach((watchedMovie) => {
    duration = duration + watchedMovie.runtime;
  });
  return duration;
};

const getGenres = (watchedMovies) => {
  let genres = [];
  watchedMovies.forEach((movie) => {
    genres = genres.concat(movie.genre);
  });
  return genres;
};

const getGenresWithCount = (watchedMovies) => {
  let genres = getGenres(watchedMovies);
  let genresWithCount = [];
  genres = genres.sort();
  let index = 0;
  while (genres.length !== 0) {
    let topGenre = genres[0];
    genresWithCount.push({
      genre: topGenre,
      count: genres.filter((i) => topGenre === i).length,
    }
    );
    genres.splice(0, genresWithCount[index].count);
    index++;
  }
  genresWithCount.sort((a, b) => {
    return (b.count - a.count);
  });
  return genresWithCount;
};

const getMoviesByPeriod = (movies, filterType) => {
  switch (filterType) {
    case StatisticsFilter.ALL:
      return movies;
    case StatisticsFilter.TODAY:
      return getMoviesByDateRange(movies, moment().hours(0).minutes(0).seconds(0).format(), moment().format());
    case StatisticsFilter.WEEK:
      return getMoviesByDateRange(movies, moment().subtract(7, `days`).format(), moment().format());
    case StatisticsFilter.MONTH:
      return getMoviesByDateRange(movies, moment().subtract(1, `month`).format(), moment().format());
    case StatisticsFilter.YEAR:
      return getMoviesByDateRange(movies, moment().subtract(1, `year`).format(), moment().format());
  }
  return movies;
};

const getChartForStatistics = (genresCtx, labelsChart, countsChart) => {
  Chart.defaults.global.defaultFontColor = `white`;
  Chart.defaults.global.defaultFontSize = 20;
  return new Chart(genresCtx, {
    plugins: [ChartDatalabels],
    type: `horizontalBar`,
    data: {
      labels: labelsChart,
      datasets: [{
        dataset: 10,
        data: countsChart,
        backgroundColor: `#FFE900`,
        barThickness: 30,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: true,
          anchor: `start`,
          align: `left`,
          padding: {
            left: 100,
            right: 0,
            top: 0,
            bottom: 0
          },
        }
      },
      legend: {
        display: false,
      },
      hover: false,
      tooltips: {
        enabled: false,
      },
      scales: {
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            min: 0,
            padding: 120,
          },
        }],
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            min: 0,
            display: false,
          },
        }],
      },
    },
  });
};

const createStatisticsTemplate = (moviesModel, selectedFilter) => {
  const watchedMovies = moviesModel.getWatchedMovies();
  const profileRating = getProfileRating(watchedMovies.length);
  const filteredMoviesByPeriod = getMoviesByPeriod(watchedMovies, selectedFilter);
  const countMoviesByPeriod = filteredMoviesByPeriod.length;
  const totalDuration = getMovieTotalDuration(filteredMoviesByPeriod);
  const totalDurationInHours = Math.trunc(totalDuration / 60);
  const totalDurationInMinutes = moment.duration(totalDuration, `minutes`).minutes();
  const genresWithCount = getGenresWithCount(filteredMoviesByPeriod);
  return (
    `<section class="statistic">
    ${profileRating ?
      `<p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${profileRating}</span>
      </p>` : ``}
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${countMoviesByPeriod} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDurationInHours} <span class="statistic__item-description">h</span> ${totalDurationInMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${countMoviesByPeriod ? genresWithCount[0].genre : `-`}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
  </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
    this._selectedFilter = StatisticsFilter.ALL;
    this._genresChart = null;
    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate(this._moviesModel, this._selectedFilter);
  }

  show() {
    super.show();
    this.rerender();
  }

  hide() {
    super.hide();
    if (this._genresChart) {
      this._genresChart.destroy();
      this._genresChart = null;
    }
    this._selectedFilter = StatisticsFilter.ALL;
  }

  recoveryListeners() {
    this.getElement().addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._selectedFilter = evt.target.value;
      this.rerender();
    });
  }

  rerender() {
    super.rerender();
    this.setActiveFilter(this._selectedFilter);
    if (this._genresChart) {
      this._genresChart.destroy();
      this._genresChart = null;
    }
    this._renderCharts();
  }

  setActiveFilter(selectedFilter) {
    const item = this.getElement().querySelector(`#statistic-${selectedFilter}`);
    if (item) {
      item.checked = true;
    }
  }

  _renderCharts() {
    const watchedMovies = this._moviesModel.getWatchedMovies();
    const filterdMoviesByPeriod = getMoviesByPeriod(watchedMovies, this._selectedFilter);
    if (!filterdMoviesByPeriod.length) {
      return;
    }
    let genresWithCount = getGenresWithCount(filterdMoviesByPeriod);
    const labelsChart = genresWithCount.map((item) => {
      return item.genre;
    });
    const countChart = genresWithCount.map((item) => {
      return item.count;
    });

    const element = this.getElement();
    const genresCtx = element.querySelector(`.statistic__chart`);
    this._genresChart = getChartForStatistics(genresCtx, labelsChart, countChart);
  }
}
