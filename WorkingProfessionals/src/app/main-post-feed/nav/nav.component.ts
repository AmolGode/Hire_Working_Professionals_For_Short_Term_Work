import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,private router:Router,private userService:UserService) {}

  ngOnInit(): void 
  {
    if(localStorage.getItem('uid') == null)
    {
      this.logout();
    }

    this.get_notiication_count();
    this.first_name = localStorage.getItem('first_name');
    this.last_name = localStorage.getItem('last_name');
  }

  // Global Variables
  total_new_msg_count = 0;
  first_name:any;
  last_name:any;

  logout()
  {
    localStorage.clear();
    this.router.navigate(['\login']);
  }

  get_notiication_count()
  {
    const uid = localStorage.getItem('uid');
    this.userService.get_notiication_count(uid).subscribe((response:any)=>{
      this.userService.total_new_msg_count = this.total_new_msg_count = response.resp;
      setTimeout(()=>{
        this.get_notiication_count();
      },1000);
      
    },(error)=>{
      console.warn(error);
    });
  }
}
