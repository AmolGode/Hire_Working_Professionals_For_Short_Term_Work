import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { BusinessProfileComponent } from '../business-profile/business-profile.component';
import { PaymentsHistoryTableComponent } from '../payments-history-table/payments-history-table.component';
// import { PaymentsHistoryTableComponent } from '../payments-history-table/payments-history-table.component';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.css']
})
export class SubscriptionPlanComponent implements OnInit {

@Input() subscriptionPlanObj:any = {};

  constructor(private userService:UserService,private _snackBar: MatSnackBar) 
  { 
    // SubscriptionPlanComponent.payHistory = this.paymentHistory;
  }

  

  ngOnInit(): void {
    SubscriptionPlanComponent.planDuration = this.subscriptionPlanObj.duration;
    SubscriptionPlanComponent.staticUserSerice = this.userService;
    SubscriptionPlanComponent.payHistory = this.userService.payHistoryTable;
    SubscriptionPlanComponent.businessProfile = this.userService.businessProfile;
  }

  // Global Variables
  static payHistory:any;
  static businessProfile:any;
  static planDuration:any;
  static staticUserSerice:any;
  static subscriptionPlanId:any;
  // t = 11;
  options = {
    // "days_added": this.subscriptionPlanObj.duration,
    "key": "rzp_test_8Vn7KU5OlIF446", // Enter the Key ID generated from the Dashboard
    "amount": "", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Acme Corp",
    "description": "Test Transaction",
    "image": "https://image.shutterstock.com/image-vector/initial-wp-letter-linked-logo-260nw-1662337984.jpg",
    "order_id": "", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    
    "prefill": {
        "name": "",
        "email": "",
        "contact": ""
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    },
    "handler":{}
};

// function (response:any){
//   alert(response.razorpay_payment_id);
//   alert(response.razorpay_order_id);
//   alert(response.razorpay_signature)
//   alert('Payment Sucessfull..!');
// }

static update_payment_to_paid(response:any,days_added:any)
{
  console.warn(response);
  const fd = new FormData();
  fd.append('order_id',response.razorpay_order_id);
  fd.append('payment_id',response.razorpay_payment_id);
  fd.append('days_added',days_added);
  fd.append('status','Paid');
  const wp_id:any = localStorage.getItem('wp_id');
  fd.append('business_account_id',wp_id);
  fd.append('subscription_plan_id',SubscriptionPlanComponent.subscriptionPlanId);
  SubscriptionPlanComponent.staticUserSerice.update_payment_order_status(fd).subscribe((response:any)=>{
    console.warn(response);
    SubscriptionPlanComponent.payHistory.get_payment_history();
    SubscriptionPlanComponent.businessProfile.get_wp_business_account_info();
  },(error:any)=>{
    console.warn(error);
  });
  alert('Payment Successfull');
}

static update_payment_to_failed(response:any)
{
  console.warn(response);
  const fd = new FormData();
  fd.append('order_id',response.error.metadata.order_id);
  fd.append('payment_id',response.error.metadata.payment_id);
  fd.append('status','Failed');
  SubscriptionPlanComponent.staticUserSerice.update_payment_order_status(fd).subscribe((response:any)=>{
    console.warn(response);
    SubscriptionPlanComponent.payHistory.get_payment_history();
  },(error:any)=>{
    console.warn(error);
  });
  // alert('Payment Failed');
}

  create_order(amt:any,reciept:any)
  {
    SubscriptionPlanComponent.subscriptionPlanId = this.subscriptionPlanObj.id;
    let business_account_id = localStorage.getItem('wp_id'); 
    let payment:any;
    this.userService.get_payment_order_id(business_account_id,amt,reciept).subscribe((response:any)=>{
      payment = response.resp;
      this.pay(payment);
      console.warn(payment);
      SubscriptionPlanComponent.payHistory.get_payment_history();
    },(error)=>{
      console.warn(error);
    });
  }

  pay(payment:any)
  {
    this.options.order_id = payment.id;
    this.options.prefill.name = localStorage.getItem('first_name')+' '+localStorage.getItem('last_name')
    const days_added = this.subscriptionPlanObj.duration;
    this.options.handler = function (response:any){
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature);
      SubscriptionPlanComponent.update_payment_to_paid(response,days_added);
    }
    // console.warn('potions ==> '+this.options);
    let rzp1 = new this.userService.nativeWindow.Razorpay(this.options);
    rzp1.on('payment.failed', function (response:any){
    SubscriptionPlanComponent.update_payment_to_failed(response);
      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
      
      alert('Payment Failed..!');
    });
    rzp1.open();
  }

  
}
