import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Global Variables
  hide = true;//password field
  login_btn_loding = false;
  user_email_id:any;//if page is redirected from signup

  @ViewChild("varify_email_id_warn_model",{static:true}) varify_email_id_warn_model:any;
  @ViewChild("varify_email_id_success_model",{static:true}) varify_email_id_success_model:any;
  @ViewChild("password_updated_model",{static:true}) password_updated_model:any;

  constructor(private userService : UserService,private router:Router,private _snackBar: MatSnackBar,private activatedRoute:ActivatedRoute,config: NgbModalConfig, private modalService: NgbModal) 
  { 
    // for model
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content:any) {
    this.modalService.open(content);
  }

  ngOnInit(): void 
  {
    this.activatedRoute.params.subscribe((params)=>{
      if(params['user_email_id'] != undefined)
      {
        this.user_email_id = params['user_email_id'];
        this.modalService.open(this.varify_email_id_success_model);
      }
    });

    if(localStorage.getItem('email_id') !== null)
    {
      this.user_email_id = localStorage.getItem('email_id');
      localStorage.removeItem('email_id');
      this.modalService.open(this.varify_email_id_warn_model);
    }

    if(localStorage.getItem('is_password_updated'))
    {
      this.modalService.open(this.password_updated_model);
      localStorage.removeItem('is_password_updated');
    }
    
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  
  signinForm = new FormGroup({
    email: this.email,
    password: this.password
  });

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }


  
  login(data:any)
  {
    this.login_btn_loding = true;
    const fd = new FormData();
    fd.append('email_id',data.email);
    fd.append('password',data.password);
    this.userService.login(fd).subscribe((response:any)=>
    {
      this.login_btn_loding = false;
      console.warn(response);
      if(response.is_valid)
      {
        localStorage.setItem('uid',response.user_id);
        localStorage.setItem('first_name',response.first_name);
        localStorage.setItem('last_name',response.last_name);
        // console.warn('Login successfully..!');
        this.router.navigate(['/nav/search']);
      }else
      {
        this.openSnackBar('Invalid Inputs..!','OK');
        console.warn('Invalid inputs..!');
      }
    },(error)=>
    {
      this.login_btn_loding = false;
      console.warn(error);
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }


}
