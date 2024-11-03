import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-item',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './delete-items.component.html',
  styleUrls: ['./delete-items.component.css']
})
export class DeleteItemComponent {

  id: string = '';

  message: string = '' 

  constructor(private apiService: ApiService) {}

  onSubmit(): void {
 
    this.apiService.deleteItem(this.id).subscribe(
      response => {
        if (response.success) {
          this.message = response.message;
        } else {
          this.message = 'Failed to delete item: ' +response.message;
        }
      },  
      error => {
        this.message = 'Error deleting item. Please try again.';
      }
    );
  }
}
