import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-customers.component.html',
  styleUrls: ['./add-customers.component.css']
})

export class AddCustomerComponent {
  customers = {
    name: '',
    mobile: '',
    address: ''
  };

  selectedFile: File | null = null;
  
  message: string = ''; 
  formValid = false;

  constructor(private apiService: ApiService) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(customerForm: any): void {
    if (customerForm.valid) {
      const formData = new FormData();
      formData.append('CustomerName', this.customers.name);
      formData.append('CustomerMobile', this.customers.mobile);
      formData.append('CustomerAddress', this.customers.address);
      if(this.selectedFile)
        formData.append('CustomerImage', this.selectedFile);

      this.apiService.addCustomer(formData).subscribe(
        response => {
          if (response.success) {
            this.message = response.message;
            this.formValid = true;

            // Clear the form fields
            this.customers = {
              name: '',
              mobile: '',
              address: ''
            };
            customerForm.resetForm();  // Reset form validation state if needed
          } else {
            this.message = 'Failed to add customer: ' + response.message;
            this.formValid = false;
          }
        },
        error => {
          this.message = 'Error adding customer. Please try again.';
          this.formValid = false;
        }
      );
    } else {
      this.message = 'Please fill out all the fields.';
      this.formValid = false;
    }
  }
}
