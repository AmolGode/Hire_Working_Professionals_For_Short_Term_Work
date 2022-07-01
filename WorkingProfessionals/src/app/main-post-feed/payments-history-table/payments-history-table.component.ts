import { AfterViewInit,Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-payments-history-table',
  templateUrl: './payments-history-table.component.html',
  styleUrls: ['./payments-history-table.component.css']
})
export class PaymentsHistoryTableComponent implements OnInit ,AfterViewInit{
  displayedColumns: string[] = ['sr_no', 'order_id', 'payment_id', 'amount','days_added','status','done_date'];
  dataSource:any;
  
  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    
    this.get_payment_history();
    // this.PAYMENT_HISTORY.push({position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'});
    this.userService.payHistoryTable = this;
  }

  PAYMENT_HISTORY: PeriodicElement[] = [
  ];

  get_payment_history()
  {
    const business_account_id:any = localStorage.getItem('wp_id');
    this.userService.get_payments_history(business_account_id).subscribe((response:any)=>{
      console.warn(response);
      this.PAYMENT_HISTORY = response.resp;
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.PAYMENT_HISTORY);
      this.dataSource.paginator = this.paginator;
    },(error)=>
    {
      console.warn(error);
    });
  }

  

}

export interface PeriodicElement {
  // position: number;
  order_id: string;
  payment_id: string;
  amount: number;
  days_added: number;
  status: string;
  done_date: string;
}


