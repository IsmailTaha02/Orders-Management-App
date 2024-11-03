import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Ensure FormsModule is imported
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isLoggedIn: boolean = true;  // Start with true to prevent immediate error message
  hasAttemptedLogin: boolean = false;  // New flag to track login attempts

  constructor(private router: Router) {}

  login() {
    this.hasAttemptedLogin = true; // Set to true once login is attempted

    if (this.username == 'admin' && this.password == 'orders') {
      this.isLoggedIn = true;
      this.navigateTo('view-customers'); // Navigate after successful login
    } else {
      console.log(this.username);
      console.log(this.password);
      this.isLoggedIn = false;
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
