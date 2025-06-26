import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  standalone: false,
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.scss']
})
export class OAuthComponent implements OnInit {
  public baseurl: string;
  constructor() {
    this.baseurl = environment.baseUrl;
   }

  ngOnInit() {
  }

}
