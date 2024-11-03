import { Route } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { AddItemComponent } from './components/items/add-items/add-items.component';
import { ViewItemsComponent } from './components/items/view-items/view-items.component';
import { UpdateItemComponent } from './components/items/update-items/update-items.component';
import { DeleteItemComponent } from './components/items/delete-items/delete-items.component';
import { ViewCustomersComponent } from './components/customers/view-customers/view-customers.component';
import { AddCustomerComponent } from './components/customers/add-customers/add-customers.component';
import { OrderdetailsComponent } from './components/orderdetails/orderdetails.component';
import { ViewCartComponent } from './components/cart/view-cart/view-cart.component';

export const routes: Route[] = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },  
  { path: 'add-items', component: AddItemComponent },
  { path: 'view-items', component: ViewItemsComponent },
  { path: 'update-items', component: UpdateItemComponent },
  { path: 'delete-items', component: DeleteItemComponent },
  { path: 'home', component: LoginComponent },
  { path: 'view-customers', component: ViewCustomersComponent },
  { path: 'add-customers', component: AddCustomerComponent },
  { path: 'view-orders', component: OrderdetailsComponent },
  { path: 'view-cart', component: ViewCartComponent },

];
