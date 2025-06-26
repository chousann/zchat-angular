import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketchatService } from 'websocketlib';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalstorageService } from '../service/localstorage.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  standalone: false,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  msgList: Array<any> = new Array<any>();
  msg: string;
  toUser: string;

  name: string;

  subscription: Subscription;
  constructor(
    private websocketService: WebsocketchatService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localstorage: LocalstorageService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.toUser = this.activatedRoute.snapshot.params['id'];
    this.name = this.activatedRoute.snapshot.params['name'];
    this.msgList = this.localstorage.getArr(this.websocketService.user.authToken + this.toUser);
    this.localstorage.remove(this.websocketService.user.authToken + this.toUser + 'noread');
    this.subscription = this.localstorage.msgEvent.subscribe(() => {
      console.log('recive message');
      this.msgList = this.localstorage.getArr(this.websocketService.user.authToken + this.toUser);
      this.localstorage.remove(this.websocketService.user.authToken + this.toUser + 'noread');
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onmsg(msg: any) {
    console.log("收到消息：");
    console.log(msg);
    this.msgList.push(JSON.parse(msg.data));
  }

  send() {
    this.websocketService.sendMsg(this.msg, this.websocketService.user.userId, this.toUser)
      .then((msg: any) => {
        if (!msg) {
          this.openSnackBar("用户未登录，无法接收信息", "Dance");
          return;
        }
        this.msgList.push(msg);
        this.localstorage.setArr(this.websocketService.user.authToken + this.toUser, this.msgList);
        this.msg = null;
      }).catch((msg: any) => {
        this.openSnackBar("用户未登录，无法接收信息", "Dance");
      })
  }

  back() {
    this.router.navigate(['/tabs']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, null, {
      duration: 3000,
      verticalPosition: "top"
    });
  }

  delete() {
    this.localstorage.remove(this.websocketService.user.authToken + this.toUser);
    this.msgList = new Array<any>();
    this.openSnackBar("聊天记录已被清空", "");
  }

  call() {
    this.router.navigate(['/webrtc', { id: this.toUser, flag: "call"}]);
  }

  datachannel() {
    this.router.navigate(['/datachannel', { id: this.toUser, flag: "call"}]);
  }

  calls() {
    this.router.navigate(['/rtcdatachannel', { id: this.toUser, flag: "call"}]);
  }

}
