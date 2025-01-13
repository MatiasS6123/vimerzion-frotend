export interface OrderDetail {
    id: number;
    cliente?: string;
    fecha: Date;
    total: number;
    metodoPago: string;
    estado: string;
}

export interface OrdersResponse {
    message: string;
    data: {
        ordenes: OrderDetail[];
        pagination: Pagination;
    };
}

export interface Pagination {
    totalItems: number;
    currentPage: number;
    pageSize: number;
}
