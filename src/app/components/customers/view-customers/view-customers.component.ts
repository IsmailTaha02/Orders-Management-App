import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface Customer {
  CustomerID: string;
  CustomerName: string;
  CustomerMobile: string;
  CustomerAddress: string;
  CustomerImage: string;
  isEditing: boolean;
  isDeleting: boolean;
}

@Component({
  selector: 'app-view-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-customers.component.html',
  styleUrls: ['./view-customers.component.css']
})
export class ViewCustomersComponent implements OnInit {

  customers: any[] = [];
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  message = "";
  isSearching: boolean = false;
  selectedFile: File | null=null;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300) // Delay to wait before making API call
    ).subscribe(searchTerm => {
      this.isSearching = searchTerm.length > 0;
      this.searchCustomers(searchTerm);
    });

    // Initial load
    this.searchCustomers('');
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSearchChange(search: string): void {
    this.searchSubject.next(search);
  }

  searchCustomers(searchTerm: string): void {
    this.apiService.getCustomers(searchTerm).subscribe(data => {
      this.customers = data;
      this.isSearching = searchTerm.length > 0;
    }, error => {
      console.error('Error fetching customers:', error);
    });
  }

  startDeleting(customer: Customer): void {
    customer.isDeleting = true;
  }

  deleteCustomer(customer: Customer): void {
    this.apiService.deleteCustomer(customer.CustomerID).subscribe(() => {
      // Update the customer list after successful deletion
      this.customers = this.customers.filter(c => c.CustomerID !== customer.CustomerID);
    }, error => {
      console.error('Error deleting customer:', error);
    });
    
    customer.isDeleting = false;
  }

  cancelDeleting(customer: Customer): void {
    customer.isDeleting = false;
  }

  startEditing(customer: Customer): void {
    customer.isEditing = true;
  }

  saveCustomer(customer: Customer): void {
    customer.isEditing = false;
    const formData = new FormData();
    formData.append('CustomerID', customer.CustomerID);
    formData.append('CustomerName', customer.CustomerName);
    formData.append('CustomerMobile', customer.CustomerMobile);
    formData.append('CustomerAddress', customer.CustomerAddress);
    if(this.selectedFile){
      formData.append('CustomerImage', this.selectedFile);}
    else
      formData.append('CustomerImage', customer.CustomerImage);
   
    this.apiService.updateCustomer(formData).subscribe(
      response => {
        if (response.success) {
          this.message = response.message;
          this.searchCustomers('');
        } else {
          this.message = 'Failed to update customer: ' + response.message;
        }
      },
      error => {
        this.message = 'Error updating customer. Please try again.';
      }
    );
  }

  cancelEditing(customer: Customer): void {
    customer.isEditing = false;
    this.searchCustomers(this.searchTerm);
  }

  addCustomer(): void {
    this.router.navigate(['add-customers']);
  }

  navigateToOrders(id: string): void {
    this.router.navigate(['view-orders'], {
      queryParams: { id }
    });
  }

  

}
