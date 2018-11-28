import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  operation: string = 'login';
  email: string = null;
  password: string = null;

  constructor( private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authenticationService.loginWithEmail(this.email, this.password).then(
      (data) =>{
        alert("Sesión iniciada");
        this.router.navigate(['home']);
        console.log(data);
      }).catch((error) =>{
        alert("Ocurrio un error");
        console.log(error);
      })
  }

  register() {
    this.authenticationService.registerWithEmail(this.email, this.password).then(
      (data) =>{
        alert("Registrado correctamente");
        console.log(data);
      }).catch((error) =>{
        alert("Ocurrio un error");
        console.log(error);
      })
  }

}
