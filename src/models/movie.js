export default class Movie {
  constructor(data) {
    this.id = data.id;
    const filmInfo = data.film_info;
    this.poster = filmInfo.poster;
    this.comments = data.comments;
    this.title = filmInfo.title;
    this.originalTitle = filmInfo.alternative_title;
    this.description = filmInfo.description;
    this.rating = filmInfo.total_rating;
    const userDetails = data.user_details;
    this.userRating = userDetails.personal_rating;
    this.director = filmInfo.director;
    this.writers = filmInfo.writers;
    this.actors = filmInfo.actors;
    this.releaseDate = filmInfo.release.date;
    this.runtime = filmInfo.runtime;
    this.country = filmInfo.release.release_country;
    this.genre = filmInfo.genre;
    this.ageLimit = filmInfo.age_rating;
    this.inWatchlist = userDetails.watchlist;
    this.isWatched = userDetails.already_watched;
    this.isFavorite = userDetails.favorite;
    this.watchingDate = userDetails.watching_date;
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.comments.map((comment) => {
        return comment.id ? comment.id : comment;
      }),
      'film_info': {
        'title': this.title,
        'alternative_title': this.originalTitle,
        'total_rating': this.rating,
        'poster': this.poster,
        'age_rating': this.ageLimit,
        'director': this.director,
        'writers': this.writers,
        'actors': this.actors,
        'release': {
          'date': this.releaseDate,
          'release_country': this.country
        },
        'runtime': this.runtime,
        'genre': this.genre,
        'description': this.description
      },
      'user_details': {
        'personal_rating': this.userRating,
        'watchlist': this.inWatchlist,
        'already_watched': this.isWatched,
        'watching_date': this.watchingDate ? new Date(this.watchingDate).toISOString() : new Date(0).toISOString(),
        'favorite': this.isFavorite
      }
    };
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  static clone(data) {
    return new Movie(data.toRAW());
  }
}
