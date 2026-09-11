export function buildPagination(page, limit, count) {
  const p = parseInt(page) || 1;
  const l = parseInt(limit) || 10;
  const total = count || 0;
  return {
    page: p,
    limit: l,
    total,
    pages: Math.ceil(total / l),
  };
}