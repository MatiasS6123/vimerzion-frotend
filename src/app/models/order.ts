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

export interface Orden {
    id: number;
    usuarioId: number;
    fecha: string;
    subtotal: string;
    descuentoTotal: string;
    total: string;
    estado: string;
    direccionEnvio: string;
    telefonoContacto: string;
    metodoPago: string;
    notas: string;
    paquetes: {
      id: number;
      ordenId: number;
      paqueteId: number;
      cantidad: number;
      precioUnitario: string;
      total: string;
      paquete: {
        id: number;
        nombre: string;
      };
    }[];
    usuario: {
      id: number;
      username: string;
      email: string;
    };
  }
  
