export const buildPropertyFilters = (query) => {
  const conditions = [];
  const values = {};

  if (query.city) {
    conditions.push("p.city LIKE :city");
    values.city = `%${query.city}%`;
  }

  if (query.type) {
    conditions.push("c.slug = :type");
    values.type = query.type;
  }

  if (query.minPrice) {
    conditions.push("p.price >= :minPrice");
    values.minPrice = Number(query.minPrice);
  }

  if (query.maxPrice) {
    conditions.push("p.price <= :maxPrice");
    values.maxPrice = Number(query.maxPrice);
  }

  if (query.rooms) {
    conditions.push("p.rooms >= :rooms");
    values.rooms = Number(query.rooms);
  }

  if (query.transactionType) {
    conditions.push("p.transaction_type = :transactionType");
    values.transactionType = query.transactionType;
  }

  if (query.minSurface) {
    conditions.push("p.surface >= :minSurface");
    values.minSurface = Number(query.minSurface);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  return { whereClause, values };
};
