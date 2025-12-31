export interface Timestamps {
    createdAt: Date;
    updatedAt: Date;
}
export interface SoftDelete {
    isDeleted: boolean;
    deletedAt?: Date;
}
export interface PaginationParams {
    page: number;
    limit: number;
    sort?: string;
    order?: 'asc' | 'desc';
}
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
//# sourceMappingURL=common.d.ts.map