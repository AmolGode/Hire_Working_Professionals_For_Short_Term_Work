import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { BasicProfileComponent } from './basic-profile/basic-profile.component';
import { BusinessCardFullViewComponent } from './business-card-full-view/business-card-full-view.component';
import { BusinessProfileComponent } from './business-profile/business-profile.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { MessagingComponent } from './messaging/messaging.component';
import { NavComponent } from './nav/nav.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: 'nav',
    component:NavComponent,
    children:[
      {
        path: 'basic-profile',
        component: BasicProfileComponent
      },
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path:'business-profile',
        component: BusinessProfileComponent
      },
      {
        path:'search/business-card-full-view/:businessAccountId',
        component: BusinessCardFullViewComponent,
        
      },
      {
        path:'messaging/:msg_to_id',
        component: MessagingComponent,
      },
      {
        path:'contact_list',
        component: ContactListComponent,
      },
      {
        path:'about-page',
        component: AboutPageComponent,
      }
      // {
      //   path:'logout',
      //   redirectTo:'/login'
      // }
    ]
  },
  // {
  //   path: 'basic-profile',
  //   component: BasicProfileComponent
  // },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPostFeedRoutingModule { }
