import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.css']
})

export class ViewItemsComponent implements OnInit {
  items: any[] = [];
  customerId = "";
  showModal: boolean = false;
  selectedItem: any = null;
  toastMessage: string = '';
  isSuccess: boolean = true;  // Determines toast message type
  showViewCartButton: boolean = false; // Controls the visibility of the 'View Cart' button

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.customerId = params['id'];
    });

    this.apiService.getItems().subscribe(
      data => { this.items = data; },
      error => { console.error('Error fetching items:', error); }
    );
  }

  increaseQuantity(item: any) {
    item.quantity = (item.quantity || 0) + 1;
  }

  decreaseQuantity(item: any) {
    if (item.quantity && item.quantity > 0) {
      item.quantity -= 1;
    }
  }

  openConfirmationDialog(item: any) {
    if (item.quantity && item.quantity > 0) {
      this.selectedItem = item;
      this.showModal = true;  // Open modal
    } else {
      this.isSuccess = false;  // Error message
      this.showToastMessage('Please select a quantity before adding to the order.');
    }
  }

  closeModal() {
    this.showModal = false;  // Close modal
    this.selectedItem = null;
  }

  confirmAddToCart() {
    if (this.selectedItem) {
      const cartData = new FormData();
      cartData.append('CustomerID', this.customerId);
      cartData.append('ItemNo', this.selectedItem.ItemNo);
      cartData.append('Quantity', this.selectedItem.quantity);
      const amount = this.selectedItem.quantity * this.selectedItem.Price;
      cartData.append('Amount', amount.toString());
    
      this.apiService.addToCart(cartData).subscribe(
        response => {
          this.isSuccess = true;  // Success message
          this.showToastMessage(`Successfully added ${this.selectedItem.quantity} of ${this.selectedItem.ItemName} to the cart.`);
          this.showViewCartButton = true;  // Show 'View Cart' button
          this.closeModal();
        },
        error => {
          this.isSuccess = false;  // Error message
          this.showToastMessage('Error adding item to the cart. Please try again.');
          this.closeModal();
        }
      );
    }
  }

  showToastMessage(message: string) {
    this.toastMessage = message;

    // Automatically hide the toast after 3 seconds
    setTimeout(() => {
      this.toastMessage = '';  // Clear the message after 3 seconds
    }, 3000);  // Duration in milliseconds
  }

  viewCart() {
    this.router.navigate(['view-cart'],{
      queryParams: {id: this.customerId }
    });  // Adjust the route based on your routing setup
  }
  
}
