import { Component, OnInit } from '@angular/core';
import { WebsocketchatService } from 'websocketlib';
import { LocalstorageService } from '../service/localstorage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
@Component({
  standalone: false,
  selector: 'app-my',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss']
})
export class MyComponent implements OnInit {

  userId: string;
  constructor(
    private localstorage: LocalstorageService,
    private snackBar: MatSnackBar,
    private websocketService: WebsocketchatService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  
  async reconnect() {

    await this.websocketService.wsconnect(this.websocketService.user.authToken);
  }

  deleteall() {
    this.localstorage.removeAll();
    this.openSnackBar('缓存已清空', null);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, null, {
      duration: 3000,
      verticalPosition: "top"
    });
  }

}
