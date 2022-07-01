import { Component, Input, OnInit } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  @Input() feedbackObj:any={};

  constructor(private userService:UserService,config: NgbRatingConfig) 
  { 
    config.max = 10;
    config.readonly = true;
  }

  ngOnInit(): void 
  {
    this.profile_pic_url = this.userService.api_url+this.feedbackObj.feedback_by_user_profile_pic;
    console.warn(this.profile_pic_url);
  }

  // Global Variables
  profile_pic_url = '';

}
