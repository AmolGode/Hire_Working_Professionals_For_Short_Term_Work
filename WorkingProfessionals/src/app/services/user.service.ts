import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

function _window() : any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root'
})


export class UserService {

  payHistoryTable:any;
  businessProfile:any;

  // For RazorPay
  get nativeWindow() : any {
    return _window();
  }

  // Global Variable
  total_new_msg_count = 0;

  BusinessCards = [];
  selectedTags: string[] = [];
  selectedCity = '';


  api_url = 'http://127.0.0.1:8000';
  constructor(private http:HttpClient) { }

  save_user(fd:any)
  {
    return this.http.post(this.api_url+'/user_api/save_user/',fd);
  }

  login(fd:any)
  {
    return this.http.post(this.api_url+'/user_api/login/',fd);
  }

  get_user_info(id:any)
  {
    return this.http.get(this.api_url+'/user_api/get_user_info/'+id);
  }

  change_profile_pic(fd:any,uid:number)
  {
    return this.http.patch(this.api_url+'/user_api/change_profile_pic/'+uid+'/',fd);
  }

  change_user_info(fd:any,uid:number)
  {
    return this.http.patch(this.api_url+'/user_api/change_user_info/'+uid+'/',fd);
  }

  change_password(fd:any,uid:number)
  {
    return this.http.patch(this.api_url+'/user_api/change_password/'+uid+'/',fd);
  }

  create_wp_business_account(fd:any)
  {
    return this.http.post(this.api_url+'/wp_api/create_wp_business_account/',fd);
  }

  get_wp_business_account_info(uid:number)
  {
    return this.http.get(this.api_url+'/wp_api/get_wp_business_account_info/'+uid+'/');
  }

  update_wp_business_account(data:any,wpId:number)
  {
    return this.http.put(this.api_url+'/wp_api/update_wp_business_account/'+wpId+'/',data);
  }

  add_wp_profession_tag(fd:any)
  {
    return this.http.post(this.api_url+'/wp_api/add_wp_profession_tag/',fd);
  }

  get_wp_profession_tags(wp_id:number)
  {
    return this.http.get(this.api_url+'/wp_api/get_wp_profession_tags/'+wp_id+'/');
  }
  delete_wp_profession_tag(tag_id:number)
  {
    return this.http.delete(this.api_url+'/wp_api/delete_wp_profession_tag/'+tag_id);
  }

  add_wp_service_area(fd:any)
  {
    return this.http.post(this.api_url+'/wp_api/add_wp_service_area/',fd);
  }
  get_wp_service_areas(wp_id:number)
  {
    return this.http.get(this.api_url+'/wp_api/get_wp_service_areas/'+wp_id+'/');
  }
  delete_wp_service_area(tag_id:number)
  {
    return this.http.delete(this.api_url+'/wp_api/delete_wp_service_area/'+tag_id);
  }

  add_wp_work_sample(fd:any)
  {
    return this.http.post(this.api_url+'/wp_api/add_wp_work_sample/',fd);
  }

  get_wp_work_samples(wp_id:number)
  {
    return this.http.get(this.api_url+'/wp_api/get_wp_work_samples/'+wp_id);
  }

  edit_wp_work_sample(fd:any,work_sample_id:number)
  {
    return this.http.patch(this.api_url+'/wp_api/edit_wp_work_sample/'+work_sample_id+'/',fd);
  }

  delete_wp_work_sample(work_sample_id:number)
  {
    return this.http.delete(this.api_url+'/wp_api/delete_wp_work_sample/'+work_sample_id+'/');
  }
  delete_wp_business_account(wp_id:number)
  {
    return this.http.delete(this.api_url+'/wp_api/delete_wp_business_account/'+wp_id+'/');
  }

  toggle_business_card_image(fd:any,work_sample_id:number)
  {
    return this.http.patch(this.api_url+'/wp_api/toggle_business_card_image/'+work_sample_id+'/',fd);
  }

  get_all_distinct_cities()
  {
    return this.http.get(this.api_url+'/wp_api/get_all_distinct_cities/');
  }

  get_all_distinct_tags()
  {
    return this.http.get(this.api_url+'/wp_api/get_all_distinct_tags/');
  }

  search_working_professionals(fd:any)
  {
    return this.http.post(this.api_url+'/search_wp_api/search_working_professionals/',fd);
  }

  get_wp_full_profile(wp_id:number)
  {
    return this.http.get(this.api_url+'/wp_api/get_wp_full_profile/'+wp_id+'/');
  }

  get_business_account_info(wp_id:number)
  {
    return this.http.get(this.api_url+'/wp_api/get_business_account_info/'+wp_id+'/');
  }

  send_message(fd:any)
  {
    return this.http.post(this.api_url+'/message_api/send_message/',fd);
  }

  get_messages(uid1:number,uid2:number)
  {
    return this.http.get(this.api_url+'/message_api/get_message/'+uid1+'/'+uid2+'/');
  }
  
  get_msg_to_user_info(uid:number)
  {
    return this.http.get(this.api_url+'/user_api/get_msg_to_user_info/'+uid+'/');
  }


  add_into_contact_list(fd:any)
  {
    return this.http.post(this.api_url+'/user_api/add_into_contact_list/',fd);
  }
  get_contact_list(uid:number)
  {
    return this.http.get(this.api_url+'/user_api/get_contact_list/'+uid+'/');
  }

  add_feedback_for_wp(fd:any)
  {
    return this.http.post(this.api_url+'/wp_api/add_feedback_for_wp/',fd);
  }
  get_wp_feedbacks(business_account_id:number)
  {
    return this.http.get(this.api_url+'/wp_api/get_wp_feedbacks/'+business_account_id+'/');
  }

  get_wp_info(business_account_id:number)
  {
    return this.http.get(this.api_url+'/wp_api/get_wp_info/'+business_account_id+'/');
  }

  get_notiication_count(uid:any)
  {
    return this.http.get(this.api_url+'/message_api/get_notiication_count/'+uid+'/');
  }

  get_new_msg_count_for_each_contact(uid:any)
  {
    return this.http.get(this.api_url+'/user_api/get_new_msg_count_for_each_contact/'+uid+'/');
  }

  get_unread_messages(uid1:number,uid2:number)
  {
    return this.http.get(this.api_url+'/message_api/get_unread_messages/'+uid1+'/'+uid2+'/');
  }

  get_verification_otp(user_email_id:any)
  {
    return this.http.get(this.api_url+'/user_api/get_verification_otp/'+user_email_id+'/');
  }
  
  change_password_via_email(fd:any)
  {
    return this.http.patch(this.api_url+'/user_api/change_password_via_email/',fd);
  }

  send_varification_link(uid:any)
  {
    return this.http.get(this.api_url+'/user_api/send_varification_link/'+uid);
  }

  get_all_subscription_plans()
  {
    return this.http.get(this.api_url+'/subscription_plans_api/get_all_subscription_plans/');
  }

  get_payment_order_id(business_account_id:any,amount:any,reciept:any)
  {
    return this.http.get(this.api_url+'/payment_api/get_payment_order_id/'+business_account_id+'/'+amount+'/'+reciept+'/');
  }

  update_payment_order_status(fd:any)
  {
    return this.http.patch(this.api_url+'/payment_api/update_payment_order_status/',fd);
  }

  get_payments_history(business_account_id:any)
  {
    return this.http.get(this.api_url+'/payment_api/get_payments_history/'+business_account_id+'/');
  }

  activate_free_trial(fd:any)
  {
    return this.http.patch(this.api_url+'/payment_api/activate_free_trial/',fd);
  }

  reapplay_for_verification(fd:any)
  {
    return this.http.patch(this.api_url+'/wp_api/reapplay_for_verification/',fd);
  }
}
