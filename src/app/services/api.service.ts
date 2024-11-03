import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Customer {
  CustomerID: string;
  CustomerName: string;
  CustomerMobile: string;
  CustomerAddress: string;
  isEditing: boolean;
  isDeleting: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private apiUrl = 'http://localhost/Orders/api.php'; 

  constructor(private http: HttpClient) { }

  getCustomers(searchTerm: string = ''): Observable<Customer[]> {
    // Construct the URL for the API request
    const url = `${this.apiUrl}?entity=customers&search=${encodeURIComponent(searchTerm)}`;
    return this.http.get<Customer[]>(url);
  }

  addCustomer(customerData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, customerData, {
      params: { entity: 'customers' }
    });
  }

  updateCustomer(customerData: FormData): Observable<any> {
    customerData.append('_method', 'PUT');
    return this.http.post(this.apiUrl, customerData, {
      params: { entity: 'customers' }
    });
  }

   deleteCustomer(customerId: string): Observable<any> {
    const data = new FormData();
    data.append('_method', 'DELETE');
    data.append('id', customerId);
    return this.http.post(this.apiUrl, data, {
      params: { entity: 'customers' }
    });
  }

  // GET request
  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}?entity=items`);
  }

  // POST request to add a new item
  addItem(itemData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, itemData, {
      params: { entity: 'items' }
    });
  }

  // PUT request to update an item
  updateItem(itemData: FormData): Observable<any> {
    itemData.append('_method', 'PUT');
    return this.http.post(this.apiUrl, itemData, {
      params: { entity: 'items' }
    });
  }

  // DELETE request
  deleteItem(itemId: string): Observable<any> {
    const data = new FormData();
    data.append('_method', 'DELETE');
    data.append('id', itemId);
    return this.http.post(this.apiUrl, data, {
      params: { entity: 'items' }
    });
  }

  getOrderDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?entity=orders&id=${id}`);
  }

  addOrder(cartData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, cartData, {
      params: { entity: 'orders' }
    });
  }

  getCartItems(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?entity=cart&id=${id}`);
  }

  addToCart(itemData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, itemData, {
      params: { entity: 'cart' }
    });
  }

  deleteCartItem(orderCode: string,deleteAll: Boolean): Observable<any> {
    const data = new FormData();
    data.append('_method', 'DELETE');
    data.append('id', orderCode);
    if (deleteAll) {
        data.append('deleteAll', 'true');
    }
    else
      data.append('deleteAll','false');
    
    return this.http.post(this.apiUrl, data, {
      params: { entity: 'cart' }
    });
  }
  
}
