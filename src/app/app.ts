import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WebsocketchatService } from 'websocketlib';
import { environment } from '../environments/environment';
import { LoadingComponent } from './common/loading/loading.component';
import { LocalstorageService } from './service/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected title = 'zchat-angular';

  constructor(
    private websocketchatService: WebsocketchatService,
    private router: Router,
    public dialog: MatDialog,
    private localstorage: LocalstorageService
  ) {
    this.init();
  }

  init() {
    this.websocketchatService.initializeApp({ url: environment.baseUrl, socketurl: environment.basesocket });
    this.websocketchatService.open.subscribe((ev: any) => {
      console.log("open event subscribe");
    });

    this.websocketchatService.close.subscribe(async (ev: any) => {
      console.log("close event subscribe");
      await this.websocketchatService.wsconnect(this.localstorage.get("authToken"));
    });

    this.websocketchatService.error.subscribe((ev: any) => {
      console.log("error event subscribe");
    });

    this.websocketchatService.message.subscribe((message: any) => {
      console.log("message event subscribe");
      let msg: any = JSON.parse(message.data);
      if (msg && msg.fromId && msg.context) {
        if (msg.context === "@video@") {
          this.router.navigate(['/webrtc', { id: msg.fromId, flag: "recive"}]);
          return;
        }

        if (msg.context === "@datachannel@") {
          this.router.navigate(['/datachannel', { id: msg.fromId, flag: "recive"}]);
          return;
        }

        var context = new String( msg.context ); 
        if (context.startsWith("@rtcdatachannel@")) {
          this.router.navigate(['/rtcdatachannel', { id: msg.fromId, flag: "recive", sessionId: context.substring(16)}]);
          return;
        }
      }
      if (msg && msg.fromId) {
        let msgList: Array<any> = new Array<any>();
        let noreadkey = this.websocketchatService.user.authToken + msg.fromId + 'noread';
        let noreadnum = this.localstorage.get(noreadkey);
        this.localstorage.set(noreadkey, ((noreadnum ? parseInt(noreadnum) : 0) + 1).toString());
        msgList = this.localstorage.getArr(this.websocketchatService.user.authToken + msg.fromId);
        msgList.push(msg);
        this.localstorage.setArr(this.websocketchatService.user.authToken + msg.fromId, msgList);
        this.localstorage.msgEvent.emit(msg);
      }
    });
    this.initauth();
  }

  initauth() {
    var arr = window.location.href.split("?");
    if (arr != null && arr.length >= 2 && arr[1] != null) {
      var token = arr[1].split("=");
      if (token != null && token.length >= 2 && token[1] != null) {
      const dialogRef = this.dialog.open(LoadingComponent, {
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result.flag) {
          this.router.navigate(['/tabs']);
        } else {
          this.router.navigate(['/oauth']);
        }
      });
  
      this.websocketchatService.getInitInfo(token[1])
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
      } else {
        this.router.navigate(['/aouth']);
      }
    } else {
      this.router.navigate(['/aouth']);
    }
  }

  requestPermission() {

    if (Notification) {//支持桌面通知
      if (Notification.permission != "granted") {//第一次询问或已经禁止通知(如果用户之前已经禁止显示通知，那么浏览器不会再次询问用户的意见，Notification.requestPermission()方法无效)
        Notification.requestPermission(function (status) {
          if (status === "granted") {//用户允许
            var instance = new Notification('webchat', {
              body: '你已开通消息通知'
            });

            instance.onclick = function () {
              console.log('onclick');
              instance.close();
            };
            instance.onerror = function () {
              console.log('onerror');
            };
            instance.onshow = function () {
              console.log('onshow');
            };
            instance.onclose = function () {
              console.log('onclose');
            };
          } else {//用户禁止
            return false
          }
        });
      }
    } else {//不支持(IE等)
      console.log('浏览器不支持通知');
    }

  }

  showNotification() {

    if (Notification) {//支持桌面通知
      if (Notification.permission == "granted") {//已经允许通知
        var instance = new Notification('webchat', {
          body: '收到新消息'
        });

        instance.onclick = function () {
          console.log('onclick');
          instance.close();
        };
        instance.onerror = function () {
          console.log('onerror');
        };
        instance.onshow = function () {
          console.log('onshow');
        };
        instance.onclose = function () {
          console.log('onclose');
        };
      }
    }
  }


  click() {
    this.websocketchatService.signInWithUserNameAndPassword("lisi", "123456")
      .then((data) => {
        console.log(data);
      });
  }
}
