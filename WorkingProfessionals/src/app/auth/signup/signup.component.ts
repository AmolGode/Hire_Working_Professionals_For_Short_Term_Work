import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private userService:UserService, private router:Router,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

    // Global Variables
    hide1 = true;//password field
    hide2 = true;//confirm password field
    pass1 = "";
    pass2 = "";
    profile_pic_url ='../../assets/static/select_profile.jpeg';
    selected_profile_pic:any;
    signup_btn_loding = false;
  


  email_id = new FormControl('', [Validators.required, Validators.email]);
  first_name = new FormControl('', [Validators.required, Validators.minLength(4)]);
  last_name = new FormControl('', [Validators.required, Validators.minLength(4)]);
  gender = new FormControl('',[Validators.required]);
  contact_number = new FormControl('', [Validators.required, Validators.minLength(10),Validators.maxLength(10)]);
  password1 = new FormControl('', [Validators.required, Validators.minLength(8)]);
  password2 = new FormControl('', [Validators.required, Validators.minLength(8)]);



  signupForm = new FormGroup({
    email_id: this.email_id,
    first_name: this.first_name,
    last_name: this.last_name,
    contact_number: this.contact_number,
    password1: this.password1,
    password2: this.password2,
    gender: this.gender
  });

  getErrorMessage() //email_id validation
  {
    if (this.email_id.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email_id.hasError('email') ? 'Not a valid email' : '';
  }


  onFileSelectProfilePic(event:any)
  {
    console.log(event);
    if(event.target.files)
    {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event:any)=>{
        this.profile_pic_url = event.target.result;
      }
    }
    this.profile_pic_url = this.selected_profile_pic = event.target.files[0];
  }

  save_user(data:any)
  {
    this.signup_btn_loding = true;
    const fd = new FormData();
    fd.append('first_name',data.first_name);
    fd.append('last_name',data.last_name);
    fd.append('gender',data.gender);
    fd.append('email_id',data.email_id);
    fd.append('contact_number',data.contact_number);
    fd.append('password',data.password1);

    if(this.selected_profile_pic != undefined)
    {
      fd.append('profile_pic',this.selected_profile_pic,this.selected_profile_pic.name);
      // fd.append('profile_pic',this.selected_profile_pic,data.first_name+' '+data.last_name);//for changing name of file or image name to  file
    }

    this.userService.save_user(fd).subscribe((response:any)=>
    {
      this.signup_btn_loding = false;
      console.warn(response);
      if(response.acc_created)
      {
        localStorage.setItem('email_id',data.email_id);
        this.router.navigate(['/login']);
      }else
      {
        this.openSnackBar(response.error,'OK');
      }
    },(error)=>
    {
      this.signup_btn_loding = false;
      console.warn(error);
      this.openSnackBar('Sorry Account Not Created..!','OK');
    });

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }





}
