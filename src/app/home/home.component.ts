import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs';
import {UserOverview} from '../models/user-overview';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public displayedColumns: string[] = ['index', 'email', 'total'];
  public usersData = new UserDataSource(this.api);
  constructor(private api: ApiService) {}

  ngOnInit() {}

  protected saveUserID(id) {
    localStorage.setItem('id', id);
  }
}

export class UserDataSource extends DataSource<any> {
  constructor(private api: ApiService) {
    super();
  }
  connect(): Observable<UserOverview[]> {
    return this.api.getAllUsersAndTotalJourneys();
  }
  disconnect() {}
}
