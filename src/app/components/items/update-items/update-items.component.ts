import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-items',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './update-items.component.html',
  styleUrls: ['./update-items.component.css']
})
export class UpdateItemComponent {
  item = {
    id: '',
    name: '',
    price: '',
    categoryId: ''
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
    formData.append('CategoryID', this.item.categoryId);
    if (this.selectedFile) {
      formData.append('ItemImage', this.selectedFile, this.selectedFile.name);
    }
    formData.append('ItemNo', this.item.id);

    this.apiService.updateItem(formData).subscribe(
     response => {
        if (response.success) {
          this.message = response.message;
          this.resetForm();
        } else {
          this.message = 'Failed to update item: ' + response.message;
        }
      },
      error => {
        this.message = 'Error update item. Please try again.';
      }
    );
  }

   resetForm(): void {
    this.item = {
      id: '',
      name: '',
      price: '',
      categoryId: ''
    };
    this.selectedFile = null;
  }
  
}
