import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service'
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { query } from '@angular/animations';

@Component({
  selector: 'app-view-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-cart.component.html',
  styleUrl: './view-cart.component.css'
})

export class ViewCartComponent {
  cartItems: any[] = [];
  customerId = "";
  message = "";
  showDeleteModal = false;
  showCancelModal = false;
  showAgreementModal = false;
  orderCodeToDelete = "";
  isSuccess = false; 
  toastMessage = "";

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.customerId = params['id'];
    });

    this.apiService.getCartItems(this.customerId).subscribe(data => {
      this.cartItems = data;
    }, error => {
      console.error('Error fetching cart items:', error);
    });
  }

  // Opens the modal
  openDeleteModal(orderCode: string): void {
    this.orderCodeToDelete = orderCode;
    this.showDeleteModal = true;
  }

  openCancelModal(): void {
    this.showCancelModal = true;
  }

  openAreementModal(): void{
    this.showAgreementModal = true;

  }
  // Closes the modal
  closeModal(): void {
    this.showDeleteModal = false;
    this.showCancelModal = false;
    this.showAgreementModal = false;
  }

  // Confirms the deletion and performs the API call
  confirmDelete(isDeleteAll: boolean): void {

    this.apiService.deleteCartItem(this.orderCodeToDelete,isDeleteAll).subscribe(
      response => {
        if (response.success) {
          this.message = response.message;
          if(isDeleteAll){
            this.cartItems = [];
            this.router.navigate(['view-items'],{queryParams: {id: this.customerId }});
          }
          else
            this.cartItems = this.cartItems.filter(item => item.OrderCode !== this.orderCodeToDelete);

        } else {
          this.message = 'Failed to delete item from the cart: ' + response.message;
        }
        this.closeModal();
      },
      error => {
        this.message = 'Error deleting item from the cart. Please try again.';
        this.closeModal();
      }
    );
  }

  addToOrder() {
    if (this.cartItems) {
      for (let item of this.cartItems){
        const OrderData = new FormData();
        OrderData.append('CustomerID', this.customerId);
        OrderData.append('ItemNo', item.ItemNo);
        OrderData.append('Quantity', item.Quantity);
        const amount = item.Quantity * item.Price;
        OrderData.append('Amount', amount.toString());
        const currentDate = new Date().toISOString().split('T')[0];
        OrderData.append('OrderDate', currentDate.toString());

        this.apiService.addOrder(OrderData).subscribe(
          response => {
            this.isSuccess = true;  // Success message
            this.showToastMessage(`Successfully added items to order of.`);
            this.closeModal();
          },
          error => {
            this.isSuccess = false;  // Error message
            this.showToastMessage('Error adding item to the order. Please try again.');
            this.closeModal();
          }
        );
      }
    }

    this.confirmDelete(true);
  }

  showToastMessage(message: string) {
    this.toastMessage = message;

    // Automatically hide the toast after 3 seconds
    setTimeout(() => {
      this.toastMessage = '';  // Clear the message after 3 seconds
    }, 3000);  // Duration in milliseconds
  }

}



