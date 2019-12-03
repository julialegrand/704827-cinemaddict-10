const filters = [
  {title: `All movies`, href: `all`, key: null},
  {title: `Watchlist`, href: `watchlist`, key: `isInWatchlist`},
  {title: `History`, href: `history`, key: `isWatched`},
  {title: `Favorites`, href: `favorites`, key: `isFavorite`}
];

const generateFilters = (movies) => {
  return filters.map((filter, index) => {
    return {
      title: filter.title,
      href: filter.href,
      count: filter.key ? movies.filter((movie) => movie[filter.key]).length : null,
      isActive: index === 0,
    };
  });
};

export {generateFilters};
