import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketchatService } from 'websocketlib';
import { LoadingComponent } from '../common/loading/loading.component';
import { LocalstorageService } from '../service/localstorage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  user: string;
  password: string;

  errorFlag: boolean;
  errorMessage: string;

  public baseurl: string;
  constructor(
    private router: Router,
    private WebsocketService: WebsocketchatService,
    public dialog: MatDialog,
    private localstorage: LocalstorageService,
    private snackBar: MatSnackBar,
  ) {
    this.baseurl = environment.baseUrl;
    this.errorFlag = false;
    this.errorMessage = '';
    // this.WebsocketService.open.subscribe((ev: any) => {
    //   console.log("open event subscribe");
    // });

    // this.WebsocketService.close.subscribe((ev: any) => {
    //   console.log("close event subscribe");
    // });

    // this.WebsocketService.error.subscribe((ev: any) => {
    //   console.log("error event subscribe");
    // });

    // this.WebsocketService.message.subscribe((message: any) => {
    //   console.log("message event subscribe");
    //   let msg: any = JSON.parse(message.data);
    //   if (msg && msg.fromId) {
    //     let msgList: Array<any> = new Array<any>();
    //     let noreadkey = this.WebsocketService.user.authToken + msg.fromId + 'noread';
    //     let noreadnum = this.localstorage.get(noreadkey);
    //     this.localstorage.set(noreadkey, ((noreadnum ? parseInt(noreadnum) : 0) + 1).toString());
    //     msgList = this.localstorage.getArr(this.WebsocketService.user.authToken + msg.fromId);
    //     msgList.push(msg);
    //     this.localstorage.setArr(this.WebsocketService.user.authToken + msg.fromId, msgList);
    //     this.localstorage.msgEvent.emit(msg);
    //   }
    // });
  }

  ngOnInit() { }

  async login() {

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result.flag) {
        this.router.navigate(['/tabs']);
      }
    });

    this.WebsocketService.signInWithUserNameAndPassword(this.user, this.password)
      .then((data: any) => {
        if (data) {
          this.localstorage.set("authToken", data.authToken);
          // this.WebsocketService.websocket.onopen = () => {
          //   this.WebsocketService.onopen();
          // }
          // this.WebsocketService.websocket.onmessage = (message: any) => {
          //   this.WebsocketService.onmsg(message);
          //   let msg: any = JSON.parse(message.data);
          //   if (msg && msg.fromId) {
          //     let msgList: Array<any> = new Array<any>();
          //     msgList = this.localstorage.getArr(data.authToken + msg.fromId);
          //     msgList.push(msg);
          //     this.localstorage.setArr(data.authToken + msg.fromId, msgList);
          //     this.localstorage.msgEvent.emit();
          //   }
          // }
          // this.WebsocketService.websocket.onclose = () => {
          //   this.WebsocketService.onclose();
          // }
          dialogRef.close({ flag: true });
          console.log(data);
        } else {
          dialogRef.close({ flag: false });
          console.log(data);
        }
      }).catch(() => {
        dialogRef.close({ flag: false });
      });
  }

  ant() {
    this.router.navigate(['/anttabs']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, null, {
      duration: 3000,
      verticalPosition: "top"
    });
  }
}
