import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { BusinessProfileComponent } from '../business-profile/business-profile.component';
@Component({
  selector: 'app-edit-work-sample',
  templateUrl: './edit-work-sample.component.html',
  styleUrls: ['./edit-work-sample.component.css']
})
export class EditWorkSampleComponent implements OnInit {

  @Input() WorkSampleObj:any={};

  constructor(private userService:UserService,private _snackBar: MatSnackBar,private businessProfile:BusinessProfileComponent) { }

  ngOnInit(): void {
    this.work_sample_image_url = this.userService.api_url+this.WorkSampleObj.work_sample_image;
    this.workSampleEditForm.disable();

    this.workSampleEditForm.get('work_sample_description')?.setValue(this.WorkSampleObj.work_sample_description); //alternative for [(ngModel)] to set value to the textarea
  }


  // Global Variables
  work_sample_image_url = '';



  workSampleEditForm = new FormGroup({
    work_sample_description : new FormControl('',[])
  });


  edit_wp_work_sample(data:any)
  {
    const work_sample_id:any = this.WorkSampleObj.id;
    const fd = new FormData();
    fd.append('work_sample_description',data.work_sample_description);
    this.userService.edit_wp_work_sample(fd,work_sample_id).subscribe((response:any)=>{
      console.warn(response);
      this.openSnackBar(response.resp,'OK');
      this.workSampleEditForm.disable();
    },(error)=>{
      console.warn(error);
      this.openSnackBar('Internal server error..!','Error, OK');
    });
  }

  delete_wp_work_sample()
  {
    const work_sample_id:any = this.WorkSampleObj.id;
    this.userService.delete_wp_work_sample(work_sample_id).subscribe((response:any)=>{
      console.warn(response);
      this.openSnackBar(response.resp,'OK');

      this.businessProfile.work_samples = this.businessProfile.work_samples.filter((item:any)=> item.id != work_sample_id);
    },(error)=>{
      console.warn(error);
      this.openSnackBar('Internal server error..!','Error, OK');
    });
  }

  toggle_business_card_image()
  {
    const work_sample_id:any = this.WorkSampleObj.id;
    const wp_id:any = localStorage.getItem('wp_id');
    var bool_value:any = !this.WorkSampleObj.is_business_card_image;

    for(let i = 0 ; i < this.businessProfile.work_samples.length; i++)
    {
      this.businessProfile.work_samples[i].is_business_card_image = false;
    }
    var py_bool_value:any;
    if(bool_value)
    {
      py_bool_value = 'True';
    }else
    {
      py_bool_value = 'False';
    }
    const fd:any = new FormData();
    fd.append('wp_business_account_id',wp_id);
    fd.append('bool_value',py_bool_value);
    this.userService.toggle_business_card_image(fd,work_sample_id).subscribe((response:any)=>{
      console.warn(response);
      this.openSnackBar(response.resp,'OK');
      this.WorkSampleObj.is_business_card_image = bool_value;
    },(error)=>{
      console.warn(error);
      this.openSnackBar('Internal server error..!','Error, OK');
    });
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
