import { Component, OnInit, ViewChild } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { flush } from '@angular/core/testing';


@Component({
  selector: 'app-basic-profile',
  templateUrl: './basic-profile.component.html',
  styleUrls: ['./basic-profile.component.css']
})
export class BasicProfileComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private userService: UserService,private _snackBar: MatSnackBar) {
    this.profileInfoForm.disable();//make all form control disable
    this.get_user_info();
  }

  ngOnInit(): void {

  }


  // Global Variables
  hide1 = true;//old password field
  hide2 = true;//new password field
  hide3 = true;//confirm new password field
  newPass1 = "";
  newPass2 = "";
  formEditable = false;
  default_pic_url = '../../assets/static/select_profile.jpeg';
  profile_pic_url = this.default_pic_url;
  userInfo: any;
  profile_pic_change_loading = false;
  selected_profile_pic: any;
  change_profile_info_loading = false;
  verification_link_loading = false;


  email_id = new FormControl('', [Validators.required, Validators.email]);
  first_name = new FormControl('', [Validators.required, Validators.minLength(4)]);
  last_name = new FormControl('', [Validators.required, Validators.minLength(4)]);
  gender = new FormControl('', [Validators.required]);
  contact_number = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);

  password1 = new FormControl('', [Validators.required, Validators.minLength(8)]);
  password2 = new FormControl('', [Validators.required, Validators.minLength(8)]);
  password3 = new FormControl('', [Validators.required, Validators.minLength(8)]);


  profileInfoForm = new FormGroup({
    email_id: this.email_id,
    first_name: this.first_name,
    last_name: this.last_name,
    contact_number: this.contact_number,
    gender: this.gender
  });

  passwordForm = new FormGroup({
    password1: this.password1,
    password2: this.password2,
    password3: this.password3,
  })

  getErrorMessage() //email validation
  {
    if (this.email_id.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email_id.hasError('email') ? 'Not a valid email' : '';
  }

  onFileSelectProfilePic(event: any) {
    console.log(event);
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.profile_pic_url = event.target.result;
      }
    }
    this.selected_profile_pic = this.profile_pic_url = event.target.files[0];
  }

  change_profile_pic() {
    this.profile_pic_change_loading = true;
    const fd = new FormData();
    const uid: any = localStorage.getItem('uid')
    if (this.profile_pic_url === this.default_pic_url) {
      fd.append('profile_pic', '');
    } else {
      fd.append('profile_pic', this.selected_profile_pic, this.selected_profile_pic.name);
    }

    this.userService.change_profile_pic(fd,uid).subscribe((response:any) => {
      if(response.is_success)
      {
        this.openSnackBar(response.resp,'OK');
        this.selected_profile_pic = undefined;
      }else
      {
        this.openSnackBar(response.error,'Error, OK');
      }
      this.profile_pic_change_loading = false;
      console.warn(response);
    },
      (error) => {
        this.profile_pic_change_loading = false;
        this.openSnackBar('Internal server error..!','Task failed, OK');
        console.warn(error);
      });

  }

  clear_profile_pic() {
    this.profile_pic_url = this.default_pic_url;
    this.selected_profile_pic = '';
  }

  get_user_info() {
    const id = localStorage.getItem('uid');
    this.userService.get_user_info(id).subscribe((response: any) => {
      console.warn(response);
      this.userInfo = response.user_info;
      if (this.userInfo.profile_pic != null) {
        this.profile_pic_url = this.userService.api_url + this.userInfo.profile_pic;
      }

    }, (error) => {
      console.warn(error);
    });
  }


  makeFormEditable() {
    if (this.profileInfoForm.disabled) {
      this.profileInfoForm.enable();
    } else {
      this.profileInfoForm.disable();
    }
  }

  change_user_info(data: any) {
    this.change_profile_info_loading = true;
    const fd = new FormData();
    const uid:any = localStorage.getItem('uid');
    fd.append('first_name', data.first_name);
    fd.append('last_name', data.last_name);
    fd.append('gender', data.gender);
    fd.append('email_id', data.email_id);
    fd.append('contact_number', data.contact_number);

    this.userService.change_user_info(fd,uid).subscribe((response:any)=>{
      console.warn(response);
      if(response.is_success)
      {
        this.openSnackBar(response.resp,'OK');
      }else{
        this.openSnackBar(response.error,'Invalid inputs,OK');
      }
      if(response.is_email_id_changed)
      {
        this.userInfo.is_email_id_verified = false;
      }
      this.change_profile_info_loading = false;
    },(error)=>
    {
      this.change_profile_info_loading = false;
      console.warn(error);
      this.openSnackBar('Internal server error..! Task failed..!','Error');
    });

  }

  change_password(data:any)
  {
    const uid:any = localStorage.getItem('uid');
    const fd = new FormData();
    fd.append('old_password',data.password1);
    fd.append('new_password',data.password2);
    this.userService.change_password(fd,uid).subscribe((response:any)=>
    {
      console.warn(response);
      if(response.is_success)
      {
        this.passwordForm.reset();
        this.openSnackBar(response.resp,'OK');
      }else
      {
        this.openSnackBar(response.error,'Error, OK');
      }
    },(error)=>
    {
      this.openSnackBar('Internal server error...!','Error, OK');
      console.warn(error);
    });
  }

  send_varification_link()
  {
    this.verification_link_loading = true;
    const uid = localStorage.getItem('uid');
    this.userService.send_varification_link(uid).subscribe((response:any)=>{
      console.warn(response);
      this.openSnackBar(response.resp,'OK');
      this.verification_link_loading = false;
    },(error)=>{
      console.warn(error);
      this.verification_link_loading = false;
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }



}
