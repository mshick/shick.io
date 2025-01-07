import { getSingle, isNumericString } from './types';

export function getPagination(
  params: { page?: string | string[] },
  pagination: { per_page: number },
  count: number,
) {
  const { per_page: perPage } = pagination;
  const currentPage = isNumericString(getSingle(params.page))
    ? Number(params.page)
    : 1;
  const pageOffset = perPage * (currentPage - 1);
  const totalPages = Math.ceil(count / perPage);

  return {
    currentPage,
    perPage,
    pageOffset,
    totalPages,
  };
}
