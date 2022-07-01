import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private userService:UserService,private _snackBar: MatSnackBar,private router:Router) { }

  ngOnInit(): void {
  }

  // Global Variables
  user_email_id_on_which_otp_is_send:any;
  hide1 = true;
  hide2 = true;
  send_otp_btn_loding = false;
  reset_password_btn_loding = false;
  OTP_is_Verified = false;
  OTP:any;
  verify_otp_btn_loding:any;

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  confirm_password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  otpFormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  forgotPasswordForm = new FormGroup({
    email: this.email,
    password: this.password,
    confirm_password:this.confirm_password,
    otpFormControl: this.otpFormControl,
  });

  send_otp()
  {
    if(this.email.invalid)
    {
      return;
    }
    this.send_otp_btn_loding = true;
    this.userService.get_verification_otp(this.email.value).subscribe((response:any)=>{
      if(response.is_otp_sent)
      {
        this.OTP = response.OTP;
        this.user_email_id_on_which_otp_is_send = this.email.value;
        this._snackBar.open('OTP is sent successfully on '+this.user_email_id_on_which_otp_is_send, 'OK');
      }else
      {
        this._snackBar.open(response.resp, 'Task Failed,OK');
      }
      this.send_otp_btn_loding = false;
    },(error)=>{
      console.warn(error);
      this._snackBar.open('Server Error : OTP is not sent..!', 'Error,OK');
      this.send_otp_btn_loding = false;
    });
  }

  verify_otp()
  {
    this.verify_otp_btn_loding = true;
    if(this.OTP == this.otpFormControl.value)
    {
      this.OTP_is_Verified = true;
      this._snackBar.open('OTP is verified sucessfully...!','OK');
    }else{
      this._snackBar.open('Invalid OTP','OK');
    }
    this.verify_otp_btn_loding = false;
  }

  change_password()
  {
    this.reset_password_btn_loding = true;
    const fd = new FormData();
    fd.append('user_email_id',this.user_email_id_on_which_otp_is_send);
    fd.append('new_password',this.password.value);

    this.userService.change_password_via_email(fd).subscribe((response:any)=>{
      console.warn(response);
      if(response.is_password_updated)
      {
        localStorage.setItem('is_password_updated','true')
        this.router.navigate(['/login']);
      }else
      {
        this._snackBar.open('Password updation failed...!','OK');
      }
      this.reset_password_btn_loding = false;
    },(error)=>
    {
      this.reset_password_btn_loding = false;
      console.warn(error);
    })
  }

}
