import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
// import { MatPaginator } from "@angular/material/paginator";
// import { MatTableDataSource } from "@angular/material/table";



@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css']
})
export class BusinessProfileComponent implements OnInit {

  @ViewChild('tagsTable',{static:false}) tagsTable: any;
  @ViewChild('serviceAreaTable',{static:false}) serviceAreaTable:any;


  

  // Global Variables
  subscriptionValidity = "0 Days Left";
  basicBusinessDetails:{id:string,business_title:string,business_description:string,note:string,status:string,free_trial_used:Boolean,verification_status:string}={
    id:"",
    business_title:"",
    business_description:"",
    note:"",
    status:"",
    free_trial_used:true,
    verification_status:""
  };
  have_busi_acc = false;//to enable save button for user who does not have business account
  update_wp_business_account_loading = false;

  // basicBusinessDetailsForm: any;
  isEditable = true;
  add_work_sample_loading = false;

  tagDisplayedColumns: string[] = ['Sr. No.', 'tag_name', 'action'];
  tagsDataSource:any = [];

  serviceAreaDisplayedColumns: string[] = ['Sr. No.', 'city_name', 'action'];
  serviceAreaDataSource:any =[];

  selected_work_sample_image:any;// it is blob object to send to server for saving it
  selected_work_sample_image_url = ''; // it is image url

  work_samples:any = [];

  subscriptionPlans:any = [];


  
  
  constructor(private userService:UserService,private _snackBar: MatSnackBar) {}

  ngOnInit(): void {

    this.get_wp_business_account_info();
    this.basicBusiDetailsForm.disable();
    this.get_all_subscription_plans();
    this.userService.businessProfile = this;
  }

  
  
  basicBusiDetailsForm = new FormGroup({
      business_title : new FormControl('',[Validators.required]),
      business_description : new FormControl('',[Validators.required]),
      note : new FormControl('',[]),
      status : new FormControl('',[])
  });

  AddProffessionTagForm = new FormGroup({
    tag_name : new FormControl('',[])
  });

  AddServiceAreaForm = new FormGroup({
    city_name : new FormControl('',[])
  });

  AddWorkSampleForm = new FormGroup({
    work_sample_image : new FormControl('',[]),
    work_sample_description : new FormControl('',[])
  });


  // *********************WP Business Account **********************
  create_wp_business_account(data:any)
  {
    const uid:any = localStorage.getItem('uid');
    const fd = new FormData();
    fd.append('business_title',data.business_title);
    fd.append('business_description',data.business_description);
    fd.append('status',data.status);
    fd.append('note',data.note);
    fd.append('user',uid);

    this.userService.create_wp_business_account(fd).subscribe((response:any)=>{
      console.warn(JSON.stringify(response));
      if(response.is_sucess)
      {
        this.openSnackBar(response.resp,'OK');

        localStorage.setItem('wp_id',response.newly_added_wp_busi_acc_id);
        this.have_busi_acc = true;
        this.basicBusiDetailsForm.disable();
      }else
      {
        this.openSnackBar(JSON.stringify(response.error),'Error, OK');
      }
    },(error)=>{
      console.warn(error);
      this.openSnackBar('Internal server error..!','Error, OK');
    });
  }

  make_editable_wp_basic_business_details()
  {
    if(this.basicBusiDetailsForm.disabled)
    {
      this.basicBusiDetailsForm.enable();
    }else
    {
      this.basicBusiDetailsForm.disable();
    }
  }

  get_wp_business_account_info()
  {
    const uid:any = localStorage.getItem('uid');
    this.userService.get_wp_business_account_info(uid).subscribe((response:any)=>{
      console.warn(response);
      if(response.have_busi_acc)
      {
        if(response.days_left >= 0)
        {
          this.subscriptionValidity = response.days_left+" "+"Days left - Expiry Date : "+response.resp.subscription_expiry_date;
        }else
        {
          this.subscriptionValidity = "Subscription Expired - Expiry Date : "+response.resp.subscription_expiry_date;
        }
        this.basicBusinessDetails = response.resp;
        this.have_busi_acc = true;
        localStorage.setItem('wp_id',response.resp.id);

        this.get_wp_profession_tags();
        this.get_wp_service_areas();
        this.get_wp_work_samples();
      }else
      {
        this.openSnackBar('Fill the above details for create business account.',' OK');
        this.have_busi_acc = false;
        this.basicBusiDetailsForm.enable();
      }
    },(error)=>{
      console.warn(error);
    });
  }

  update_wp_business_account()
  {
    this.update_wp_business_account_loading = true;
    const wp_id:any = localStorage.getItem('wp_id');
    const fd = new FormData();
    fd.append('business_title',this.basicBusinessDetails.business_title);
    fd.append('business_description',this.basicBusinessDetails.business_description);
    fd.append('note',this.basicBusinessDetails.note);
    fd.append('status',this.basicBusinessDetails.status);
    this.userService.update_wp_business_account(fd,wp_id).subscribe((response:any)=>{
      console.warn(response.resp);
      if(response.is_sucess)
      {
        this.openSnackBar(response.resp,'OK');
        this.basicBusiDetailsForm.disable();
      }else
      {
        this.openSnackBar(JSON.stringify(response.error),'Error, OK');
      }
      this.update_wp_business_account_loading = false;
    },(error)=>{
      console.warn(error);
      this.openSnackBar('Internal server error..!','Error, OK');
      this.update_wp_business_account_loading = false;
    })
  }

  activate_free_trial()
  {
    const business_account_id:any = localStorage.getItem('wp_id');
    const fd = new FormData();
    fd.append('business_account_id',business_account_id);
    this.userService.activate_free_trial(fd).subscribe((response:any)=>{
      this.openSnackBar(response.resp,'OK');
      this.basicBusinessDetails.free_trial_used = true;
    },(error)=>{
      console.warn(error);
      this.openSnackBar('Operation failed..! Server Error','Error,OK');
    })
  }

  reapplay_for_verification()
  {
    const wp_id:any = localStorage.getItem('wp_id');
    const fd = new FormData();
    fd.append('wp_id',wp_id);
    this.userService.reapplay_for_verification(fd).subscribe((response:any)=>{
      this.openSnackBar(response.resp,'OK');
      this.basicBusinessDetails.verification_status = "Pending";
    },(error)=>{
      console.warn(error);
    })
  }

  // *********************WP Business Account End**********************

  // *********************Profession Tag**********************
  add_wp_profession_tag(data:any)
  {
      if(data.tag_name.length < 2)
      {
        this.openSnackBar('Tag name is to short','Invalid input , OK');
        return;
      }
      const wp_id:any = localStorage.getItem('wp_id');
      const fd = new FormData()
      fd.append('tag_name',data.tag_name);
      fd.append('business_account',wp_id);
      this.userService.add_wp_profession_tag(fd).subscribe((response:any)=>{
        console.warn(response);
        if(response.is_success)
        {
          this.openSnackBar(response.resp,'OK');
          const new_tag = {'id':response.newly_added_tag_id, 'tag_name':data.tag_name}
          this.tagsDataSource.push(new_tag);
          console.warn('tagsDataSource data source after add = '+this.tagsDataSource);
          this.tagsTable.renderRows();
          
          this.AddProffessionTagForm.reset();
        }else
        {
          this.openSnackBar('Tag is adding failed...! ','Error, OK');
        }
      },(error)=>{
        console.warn(error);
      })
  }


  get_wp_profession_tags()
  {
    const wp_id:any = localStorage.getItem('wp_id');
    this.userService.get_wp_profession_tags(wp_id).subscribe((response:any)=>{
      console.warn(response);
      this.tagsDataSource = response.resp;
    },(error)=>
    {
      console.warn(error);
    })
  }

  delete_wp_profession_tag(tag_id:any,tag_name:string)
  {
    this.userService.delete_wp_profession_tag(tag_id).subscribe((response:any)=>
    {
      console.warn(response);
      if(response.is_deleted)
      {
        this.openSnackBar(tag_name+' deleted successfully..!','OK');
        this.tagsDataSource = this.tagsDataSource.filter((item:any)=> item.id !== tag_id); //For removing an tag object from array of objects
      }else
      {
        this.openSnackBar(tag_name+' deleting failed..!','Error, OK');
      }
    },(error)=>{
      console.warn(error);
      this.openSnackBar('Internal server error..!','Error, OK');
    });
  }
  // *********************Profession Tag End**********************

   // *********************Service Area *********************

   add_wp_service_area(data:any)
  {
      if(data.city_name.length < 4)
      {
        this.openSnackBar('City name is to short','Invalid input , OK');
        return;
      }
      const wp_id:any = localStorage.getItem('wp_id');
      const fd = new FormData();
      fd.append('city_name',data.city_name);
      fd.append('business_account',wp_id);
      this.userService.add_wp_service_area(fd).subscribe((response:any)=>{
        console.warn('service ares resp = '+JSON.stringify(response));
        if(response.is_success)
        {
          this.openSnackBar(response.resp,'OK');
          const new_service_area = {'id':response.newly_added_service_area_id, 'city_name':data.city_name}
          this.serviceAreaDataSource.push(new_service_area);

          console.warn('Service data source after add = '+this.serviceAreaDataSource);

          this.serviceAreaTable.renderRows();
          
          this.AddServiceAreaForm.reset();
        }else
        {
          this.openSnackBar('Tag is adding failed...! ','Error, OK');
        }
      },(error)=>{
        console.warn(error);
      })
  }

  get_wp_service_areas()
  {
    const wp_id:any = localStorage.getItem('wp_id');
    this.userService.get_wp_service_areas(wp_id).subscribe((response:any)=>{
      console.warn(response);
      this.serviceAreaDataSource = response.resp;
    },(error)=>
    {
      console.warn(error);
    })
  }

  delete_wp_service_area(service_area_id:any,city_name:string)
  {
    this.userService.delete_wp_service_area(service_area_id).subscribe((response:any)=>
    {
      console.warn(response);
      if(response.is_deleted)
      {
        this.openSnackBar(city_name+' deleted successfully..!','OK');
        this.serviceAreaDataSource = this.serviceAreaDataSource.filter((item:any)=> item.id !== service_area_id); //For removing an city object from array of objects

      }else
      {
        this.openSnackBar(city_name+' deleting failed..!','Error, OK');
      }
    },(error)=>{
      console.warn(error);
      this.openSnackBar('Internal server error..!','Error, OK');
    });
  }

   // *********************Service Area End*********************

   //************************Add Wprk samples *********************/
  
  onFileSelectProfilePic(event:any)
  {
    console.log(event);
    if(event.target.files)
    {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event:any)=>{
        this.selected_work_sample_image_url = event.target.result;
      }
    }
    this.selected_work_sample_image_url = this.selected_work_sample_image = event.target.files[0];
  }

  add_wp_work_sample(data:any)
  {
    this.add_work_sample_loading = true;
    if(this.selected_work_sample_image == undefined)
    {
      this.openSnackBar('Please select work sample image..','Invalid Input, OK');
      this.add_work_sample_loading = false;
      return;
    }
    const wp_id:any = localStorage.getItem('wp_id');
    const fd = new FormData();
    fd.append('work_sample_description',data.work_sample_description);
    fd.append('work_sample_image',this.selected_work_sample_image,this.selected_work_sample_image.name);
    fd.append('business_account',wp_id);
    this.userService.add_wp_work_sample(fd).subscribe((response:any)=>{
      console.warn(response);
      if(response.is_success)
      {
        this.openSnackBar('Work sample is added successfully..!','OK');
        const work_sample_obj = {
          'id':response.newly_added_work_sample_id,
          'work_sample_image': response.newly_added_work_sample_image,
          'work_sample_description': data.work_sample_description
        };
        this.work_samples.push(work_sample_obj);
        this.AddWorkSampleForm.reset();
        this.selected_work_sample_image = undefined;
      }else
      {
        this.openSnackBar(JSON.stringify(response.error),'Error, OK');
      }
      this.add_work_sample_loading = false;
    },(error)=>{
      console.warn(error);
      this.add_work_sample_loading = false;
    });
  }

  get_wp_work_samples()
  {
    const wp_id:any = localStorage.getItem('wp_id');
    this.userService.get_wp_work_samples(wp_id).subscribe((response:any)=>{
      console.warn(response);
      this.work_samples = response.resp;

    },(error)=>{
      console.warn(error);
    });
  }


   //*************************Add Work samples end ***********************/

  // ***************** Subscription plans start *************************************/

  get_all_subscription_plans()
  {
    this.userService.get_all_subscription_plans().subscribe((response:any)=>{
      this.subscriptionPlans = response.resp;
    },(error)=>{
      console.warn(error);
    })
  }
  // ***************** Subscription plans END *************************************/

   delete_wp_business_account()
   {
    const wp_id:any = localStorage.getItem('wp_id');
    this.userService.delete_wp_business_account(wp_id).subscribe((response:any)=>{
      console.warn(response);
      this.openSnackBar('Business account deleted sucessfully...!','OK');
      this.have_busi_acc = false;
      localStorage.removeItem('wp_id');
    },(error)=>{
      console.warn(error);
    });
   }

   delete_btn_enable = false;
   toggle_delete_wp_business_sccount_btn()
   {
     this.delete_btn_enable =! this.delete_btn_enable;
   }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}

