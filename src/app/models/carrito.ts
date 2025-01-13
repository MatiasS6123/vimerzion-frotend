export interface CarritoItem {
  id: number; // ID del paquete
  nombre: string; // Nombre del paquete
  precio: number; // Precio unitario del paquete
  cantidad: number; // Cantidad agregada al carrito
  subtotal?: number; // Subtotal calculado (precio x cantidad)
}
