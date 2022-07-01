import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainPostFeedRoutingModule } from './main-post-feed-routing.module';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BasicProfileComponent } from './basic-profile/basic-profile.component';
import { SearchComponent } from './search/search.component';

import {MatChipsModule} from '@angular/material/chips';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { BusinessCardComponent } from './business-card/business-card.component';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { BusinessProfileComponent } from './business-profile/business-profile.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTableModule} from '@angular/material/table';
import { EditWorkSampleComponent } from './edit-work-sample/edit-work-sample.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { BusinessCardFullViewComponent } from './business-card-full-view/business-card-full-view.component';
import { WorkSampleComponent } from './work-sample/work-sample.component';
import { MessagingComponent } from './messaging/messaging.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackComponent } from './feedback/feedback.component';
import { AboutPageComponent } from './about-page/about-page.component';
import {MatBadgeModule} from '@angular/material/badge';
import { SubscriptionPlanComponent } from './subscription-plan/subscription-plan.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { PaymentsHistoryTableComponent } from './payments-history-table/payments-history-table.component';
import { HomePageContentComponent } from './home-page-content/home-page-content.component';



@NgModule({
  declarations: [NavComponent, BasicProfileComponent, SearchComponent, BusinessCardComponent, BusinessProfileComponent, EditWorkSampleComponent, BusinessCardFullViewComponent, WorkSampleComponent, MessagingComponent, ContactListComponent, FeedbackComponent, AboutPageComponent, SubscriptionPlanComponent, PaymentsHistoryTableComponent, HomePageContentComponent],
  imports: [
    CommonModule,
    MainPostFeedRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatRadioModule,
    FormsModule,
    MatStepperModule,
    MatTableModule,
    MatSlideToggleModule,
    NgbModule,
    MatBadgeModule,
    MatPaginatorModule
  ]
})
export class MainPostFeedModule { }
