import { Component, OnInit } from '@angular/core';
import { WebsocketchatService } from 'websocketlib';
import { LocalstorageService } from '../../service/localstorage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  constructor(
    private WebsocketService: WebsocketchatService,
    public dialog: MatDialog,
    private localstorage: LocalstorageService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  reconnect() {
    this.WebsocketService.wsconnect(this.WebsocketService.user.authToken);
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
