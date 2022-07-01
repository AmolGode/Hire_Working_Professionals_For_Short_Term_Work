import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-work-sample',
  templateUrl: './work-sample.component.html',
  styleUrls: ['./work-sample.component.css']
})
export class WorkSampleComponent implements OnInit {

  @Input() WorkSample:any={};

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.work_sample_image_url = this.userService.api_url+this.WorkSample.work_sample_image;
  }

  work_sample_image_url = '';
}
