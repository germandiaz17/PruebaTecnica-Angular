import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  loginVerification() {
    const userlogin = localStorage.getItem('username');
    if(userlogin) {
      this.router.navigate(['/']);
    };
  };
  
  login(form: NgForm) {
    if (form.valid) {
       //Este usuario es solo para pruebas, en caso de pasar a produccion no se implementaria de esta forma
       //Se implementaria un sistema de registro de usuarios
      const validUser= 'admin';
      const validPass= 'root';  
      if(this.username === validUser && this.password === validPass) {
        localStorage.setItem('username', this.username)
        this.router.navigate(['/'])
      }else{
        alert('los datos que haz ingresado no son correctos!')
      }
    }else{
      alert('no haz completado los campos requeridos!')
    }
  }
};
