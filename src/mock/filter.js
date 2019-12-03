const filters = [
  {title: `All movies`, href: `all`},
  {title: `Watchlist`, href: `watchlist`},
  {title: `History`, href: `history`},
  {title: `Favorites`, href: `favorites`}
];

const COUNT_FILTER = 20;

const generateFilters = () => {
  return filters.map((filter, index) => {
    return {
      title: filter.title,
      href: filter.href,
      count: index !== 0 ? Math.round(Math.random() * COUNT_FILTER) : null,
      isActive: index === 0,
    };
  });
};

export {generateFilters};
