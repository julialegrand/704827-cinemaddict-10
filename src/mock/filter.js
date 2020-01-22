const FILTERS = [
  {title: `All movies`, href: `all`, key: null},
  {title: `Watchlist`, href: `watchlist`, key: `inWatchlist`},
  {title: `History`, href: `history`, key: `isWatched`},
  {title: `Favorites`, href: `favorites`, key: `isFavorite`}
];

const generateFilters = (movies) => {
  return FILTERS.map((filter, index) => {
    return {
      title: filter.title,
      href: filter.href,
      count: filter.key ? movies.filter((movie) => movie[filter.key]).length : null,
      isActive: index === 0,
    };
  });
};

export {generateFilters};
