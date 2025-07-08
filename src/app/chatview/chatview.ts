import { Component } from '@angular/core';
import { Location } from '@angular/common'

@Component({
  selector: 'app-chatview',
  standalone: false,
  templateUrl: './chatview.html',
  styleUrl: './chatview.scss'
})
export class Chatview {
  constructor(public location: Location
  ) {

  }

  back() {
    this.location.back();
  }

}
