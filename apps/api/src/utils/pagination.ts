import { Request } from 'express';

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export const getPagination = (req: Request): PaginationParams => {
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 20);
  return {
    page: Number.isNaN(page) ? 1 : Math.max(page, 1),
    pageSize: Number.isNaN(pageSize) ? 20 : Math.min(Math.max(pageSize, 1), 100),
  };
};
