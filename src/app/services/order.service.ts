import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrdersResponse } from '../models/order';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private API_URL = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) {}

  createOrderWithWebpay(orderData: any) {
    return this.http.post<{ transactionUrl: string }>(`${this.API_URL}/webpay`, orderData);
  }
  confirmWebpayTransaction(token: string) {
    return this.http.post(`${this.API_URL}/webpay/confirm`, { token });
  }
  getAllOrders(skip: number = 0, take: number = 10): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.API_URL}/paquetes?skip=${skip}&take=${take}`);
}
getAllOrdersById(userId:number,skip: number = 0, take: number = 10): Observable<OrdersResponse> {
  return this.http.get<OrdersResponse>(`${this.API_URL}/paginated/${userId}?skip=${skip}&take=${take}`);
}


  
  
}
