export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  type?: string;
  title?: string;
  status: number;
  detail?: string;
  errors?: Record<string, string[]>;
}
