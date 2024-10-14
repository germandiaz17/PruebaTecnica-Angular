import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router) {}

  userloginVerfication() {
    const username = localStorage.getItem('username');

    if(!username) {
      this.router.navigate(['/login'])
    }
  };

  logout() {
    localStorage.removeItem('username');

    this.router.navigate(['/login']);
  };
};
