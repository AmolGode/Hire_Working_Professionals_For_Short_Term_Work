import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';

import {
  Inject,
  LOCALE_ID }
  from '@angular/core';
import { formatNumber } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-business-card-full-view',
  templateUrl: './business-card-full-view.component.html',
  styleUrls: ['./business-card-full-view.component.css']
})
export class BusinessCardFullViewComponent implements OnInit {


  constructor(private activatedRoute:ActivatedRoute,public userService:UserService,private _snackBar: MatSnackBar,private router:Router,config: NgbRatingConfig,@Inject(LOCALE_ID) public locale: string) 
  { 
    config.max = 10;
    config.readonly = false;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params)=>{
      this.businessAccountId = params['businessAccountId'];
      console.warn(params)
    });
    this.get_wp_work_samples();
    this.get_wp_info();
    this.get_wp_feedbacks();
  }

  // Global Variables
  businessAccountId:number=-1;
  wpWorkSamples:any={};
  wpBusinessAccountInfo:any={};
  work_sample_image_url:any;
  users_wp_rating:any = 0;
  wpFeedbacks:any = [];
  profile_pic_url = '';
  wp_rating:any = 0.0;


  feedbackTextAreaControl = new FormControl('',[]);

  get_wp_work_samples()
  {
    this.userService.get_wp_work_samples(this.businessAccountId).subscribe((response:any)=>
    {
      this.wpWorkSamples = response.resp;
    },(error)=>{
      console.warn(error);
    })
  }

  get_wp_info()
  {
    this.userService.get_wp_info(this.businessAccountId).subscribe((response:any)=>
    {
      console.warn('Business acc === '+response);
      this.wpBusinessAccountInfo = response.resp;
      this.profile_pic_url = this.userService.api_url+this.wpBusinessAccountInfo.profile_pic; 
    },(error)=>{
      console.warn(error);
    })
  }

  add_to_contact_list_and_goto_messaging()
  {
    // adding working professional into the contact list
    const user1:any = localStorage.getItem('uid');
    const user2 = this.wpBusinessAccountInfo.user_id;

    if(user1 == user2)
    {
      this._snackBar.open('You can not chat with you..!','OK');
      return;
    }
    this.add_user_to_contact_list(user1,user2);
    this.add_user_to_contact_list(user2,user1);

    this.router.navigate(['nav/messaging/'+this.wpBusinessAccountInfo.user_id]);
  }

  add_user_to_contact_list(user1:any,user2:any)
  {
    const fd = new FormData();
    
    fd.append('user',user1);
    fd.append('in_contact_with',user2);
    this.userService.add_into_contact_list(fd).subscribe((response)=>
    {
      console.warn(response);
    },(error)=>{
      console.warn(error);
    });
  }

  add_feedback_for_wp()
  {
    const business_accoint_id:any = this.businessAccountId;
    const feedback_text = this.feedbackTextAreaControl.value;
    const uid:any = localStorage.getItem('uid');
    const fd = new FormData()
    fd.append('business_account',business_accoint_id);
    fd.append('feedback_text',feedback_text);
    fd.append('rating',this.users_wp_rating);
    fd.append('feedback_by',uid);
    this.userService.add_feedback_for_wp(fd).subscribe((response:any)=>{
      console.warn(response);
      this.wpFeedbacks.unshift(response.new_feedback);
      this.feedbackTextAreaControl.reset();
    },(error)=>{
      console.warn(error);
    })
  }

  get_wp_feedbacks()
  {
    const business_accoint_id:any = this.businessAccountId;
    this.userService.get_wp_feedbacks(business_accoint_id).subscribe((response:any)=>{
      console.warn(response);
      this.wpFeedbacks = response.resp;
      let sum = 0;
      for(let i = 0 ; i < this.wpFeedbacks.length ; i++)
      {
        sum += this.wpFeedbacks[i].rating;
      }     
      this.wp_rating = formatNumber(parseFloat(sum/this.wpFeedbacks.length+""),this.locale,'2.1-2');
    },(error)=>{
      console.warn(error);
    })
  }

}
