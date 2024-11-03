import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.css']
})
export class AddItemComponent {
  item = {
    name: '',
    price: '',
  };

  selectedFile: File | null = null;

  message: string = ''; 

  constructor(private apiService: ApiService) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('ItemName', this.item.name);
    formData.append('Price', this.item.price);
    if (this.selectedFile) {
      formData.append('ItemImage', this.selectedFile, this.selectedFile.name);
    }

    this.apiService.addItem(formData).subscribe(
      response => {
        if (response.success) {
          this.message = response.message;
        } else {
          this.message = 'Failed to add item: ' + response.message;
        }
      },
      error => {
        this.message = 'Error adding item. Please try again.';
      }
    );
  }
}
