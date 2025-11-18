export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
