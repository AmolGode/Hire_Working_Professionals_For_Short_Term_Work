import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  constructor(private userService:UserService,private router:Router) { }

  ngOnInit(): void {
    this.get_contact_list();
    
  }

  // Global varicables
  contactList:any = [];
  api_url = this.userService.api_url+'/media/';
  old_total_new_msg_count = -1;
  
  get_contact_list()
  {
    const uid:any = localStorage.getItem('uid');
    this.userService.get_contact_list(uid).subscribe((response:any)=>{
      console.warn('Hii =====> '+response.resp[0].in_contact_with_id);
      this.contactList = response.resp;
      this.get_new_msg_count_for_each_contact();
    },(error)=>{
      console.warn(error);
    });
  }

  open_chat_box(in_contact_with_uid:any)
  {
    this.router.navigate(['nav/messaging/'+in_contact_with_uid]);
  }

  get_new_msg_count_for_each_contact()
  {
      if(this.old_total_new_msg_count == this.userService.total_new_msg_count)
      { 
        setTimeout(()=>{
          this.get_new_msg_count_for_each_contact();
        },1000);
        return;
      }
        this.old_total_new_msg_count = this.userService.total_new_msg_count;
        const uid = localStorage.getItem('uid');
        this.userService.get_new_msg_count_for_each_contact(uid).subscribe((response:any)=>{

        for(let i = 0 ; i < response.resp.length ; i++)
        {
          for(let j = 0; j < this.contactList.length ; j++)
          {
            if(response.resp[i].in_contact_with_id == this.contactList[j].in_contact_with_id)
            {
              this.contactList[j].new_msg_count = response.resp[i].new_msg_count;
              break;
            }
          } 
        }
     
        setTimeout(()=>{
          this.get_new_msg_count_for_each_contact();
        },1000);
      
    
    },(error)=>{
      console.warn(error);
    });
  }

}