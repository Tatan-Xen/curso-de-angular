import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service'
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  operation: string = 'login';
  email: string = null;
  password: string = null;
  nick: string = null;

  constructor( private authenticationService: AuthenticationService, private router: Router, private userService: UserService) {}

  ngOnInit() {
  }

  login() {
    this.authenticationService.loginWithEmail(this.email, this.password).then(
      (data) =>{
        alert("Sesión iniciada");
        console.log(data);
        this.router.navigate(['home']);
      }).catch((error) =>{
        alert("Ocurrio un error");
        console.log(error);
      })
  }

  register() {
    this.authenticationService.registerWithEmail(this.email, this.password).then(
      (data) =>{
        const user = {
          uid: data.user.uid,
          email: this.email,
          nick: this.nick
        };
        this.userService.createUser(user).then((data)=>{
          alert("Registrado correctamente");
          console.log(data);
        }).catch((error)=>{
          alert("Ocurrio un error");
          console.log(error);
        })
        
      }).catch((error) =>{
        alert("Ocurrio un error");
        console.log(error);
      })
  }

}
