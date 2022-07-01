import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

  constructor(private userService:UserService,private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params)=>{
      this.msg_to_id = params['msg_to_id'];
      
    });

    this.get_msg_to_user_info();
    this.get_messages();
    console.warn(this.msg_to_user_profile_pic_url);
  }

  ngOnDestroy()
  {
    this.get_message_flag = false;
  }

  // Global variables
  msg_to_id = -1;
  msgToUserObj:any={};
  message_arr:any=[];
  messageFormControl = new FormControl('',[]);
  msg_to_user_profile_pic_url='';
  get_message_flag = true;

  
  send_message()
  {
    if(this.messageFormControl.value == "")
    {
      return;
    }
    console.warn(this.messageFormControl.value);
    const msg_from_id:any = localStorage.getItem('uid');
    const msg_to_id:any = this.msg_to_id;
    const fd = new FormData();
    fd.append('msg_from',msg_from_id);
    fd.append('msg_to',msg_to_id);
    fd.append('message',this.messageFormControl.value);
    this.userService.send_message(fd).subscribe((response:any)=>{
      console.warn(response);
      this.message_arr.push(response.new_message);
      this.messageFormControl.reset();
    },(error)=>{
      console.warn(error);
    });
  }

  get_messages()
  {
    const uid1:any = localStorage.getItem('uid');
    const uid2:any = this.msg_to_id;
    this.userService.get_messages(uid1,uid2).subscribe((response:any)=>{
      console.warn(response);
      this.message_arr = response.resp;
      setTimeout(() => {
        if(this.get_message_flag)
        {
          // wait 1 sec and then start to check for unread messages
        }
      }, 1000);
      this.get_unread_messages();

    },(error)=>{
      console.warn(error);
    });
  }

  get_unread_messages()
  {
    const uid1:any = localStorage.getItem('uid');
    const uid2:any = this.msg_to_id;
    this.userService.get_unread_messages(uid1,uid2).subscribe((response:any)=>{
      // console.warn(response);

      if(response.resp.length > 0)
      {
        this.message_arr.push(...response.resp);
      }
      setTimeout(() => {
        if(this.get_message_flag)
        {
          this.get_unread_messages();
        }
      }, 1000);

      
    },(error)=>{
      console.warn(error);
    });
  }

  get_msg_to_user_info()
  {
    this.userService.get_msg_to_user_info(this.msg_to_id).subscribe((response:any)=>{
      console.warn(response);
      this.msgToUserObj = response.resp;
      this.msg_to_user_profile_pic_url = this.userService.api_url+this.msgToUserObj.profile_pic;
    },(error)=>{
      console.warn(error);
    });
  }

  



}
