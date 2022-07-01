import { Component, Injectable, OnInit } from '@angular/core';

// for angular material chips
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormBuilder, FormGroup} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  //**********************************************Tag chips start */
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: any;
  selected_tags: string[] = this.userService.selectedTags;//Default selected value
  selectedCity = this.userService.selectedCity;
  allTags: string[] = [];
  BusinessCards:any = this.userService.BusinessCards;

  @ViewChild('fruitInput') fruitInput: any;

  constructor(private _formBuilder: FormBuilder, private userService:UserService) {
    
  }

  ngOnInit() 
  {
    this.get_all_distinct_cities();
    this.get_all_distinct_tags();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) 
    {
      this.selected_tags.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }

  remove(fruit: string): void 
  {
    const index = this.selected_tags.indexOf(fruit);
    if (index >= 0) 
    {
      this.selected_tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selected_tags.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter_tags(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }
  //**********************************************Tag chips end */

  // ****************Autocomplete city start**
  myCityControl = new FormControl();
  cities: string[] = [];
  filteredCityOptions: any;

  private _filter_cities(value: string): string[] 
  {
    const filterValue = value.toLowerCase();
    return this.cities.filter(option => option.toLowerCase().includes(filterValue));
  }
  // ****************Autocomplete city end**
  
  

  // My funcitons...!
  get_all_distinct_cities()
  {
    this.userService.get_all_distinct_cities().subscribe((responnse:any)=>{
      console.warn(responnse);
      for(let i = 0 ; i < responnse.resp.length;i++)
      {
        this.cities.push(responnse.resp[i].city_name);
      }

      // City autocomplete start
      this.filteredCityOptions = this.myCityControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter_cities(value)),
      );
      // City autocomplete end
    },(error)=>{
      console.warn(error);
    })
  }

  get_all_distinct_tags()
  {
    this.userService.get_all_distinct_tags().subscribe((responnse:any)=>{
      console.warn(responnse);
      for(let i = 0 ; i < responnse.resp.length;i++)
      {
        this.allTags.push(responnse.resp[i].tag_name);
      }

      this.filteredTags = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => (fruit ? this._filter_tags(fruit) : this.allTags.slice())),
      );

    },(error)=>{
      console.warn(error);
    })
  }

  search_working_professionals()
  {
    const city = this.myCityControl.value;
    console.warn(city);
    console.warn(this.selected_tags);
    const fd:any = new FormData();
    fd.append('city_name',this.myCityControl.value);
    fd.append('tag_arr',this.selected_tags)
    this.userService.search_working_professionals(fd).subscribe((response:any)=>
    {
      console.warn(response);
      this.userService.BusinessCards = this.BusinessCards = response.resp;
      this.userService.selectedCity = this.myCityControl.value;
      this.userService.selectedTags = this.selected_tags;
    },(error)=>{
      console.warn(error);
    })
  }

  clear_business_cards()
  {
    this.userService.BusinessCards = this.BusinessCards = [];
      this.userService.selectedCity = '';
      this.myCityControl.setValue('');
      this.userService.selectedTags = this.selected_tags = [];
  }



}
