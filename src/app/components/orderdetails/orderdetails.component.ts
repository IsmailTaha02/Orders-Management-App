import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service'
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orderdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orderdetails.component.html',
  styleUrl: './orderdetails.component.css'
})
export class OrderdetailsComponent {

  orders: any[] = [];
  customerId="";

  constructor(private apiService: ApiService, private router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.customerId = params['id']});

    this.apiService.getOrderDetails(this.customerId).subscribe(data => {
      this.orders = data;
    }, error => {
      console.error('Error fetching orders:', error);
    });
  }

  navigateToItems(): void {
    this.router.navigate(['view-items'],{queryParams: {id: this.customerId} });
  }

}
