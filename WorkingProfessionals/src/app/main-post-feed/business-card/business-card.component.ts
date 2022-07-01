import { formatNumber } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';

import {
  Inject,
  LOCALE_ID }
  from '@angular/core';

@Component({
  selector: 'app-business-card',
  templateUrl: './business-card.component.html',
  styleUrls: ['./business-card.component.css']
})
export class BusinessCardComponent implements OnInit {

@Input() BusinessCardObj:any={};

  constructor(private userService:UserService,config: NgbRatingConfig,@Inject(LOCALE_ID) public locale: string) 
  { 
    config.max = 10;
    config.readonly = true;
  }

  ngOnInit(): void 
  {
    this.work_sample_image_url = this.userService.api_url+this.BusinessCardObj.work_sample_image;
    this.profile_pic_url = this.userService.api_url+this.BusinessCardObj.profile_pic;  
    this.wp_rating = formatNumber(parseFloat(this.BusinessCardObj.average_rating),this.locale,'2.1-2');
  }

  // Global
  work_sample_image_url = '';
  profile_pic_url = '';
  wp_rating:any;  
}
