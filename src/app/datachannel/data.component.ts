import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebRTCDataChannelComponent } from 'WebRTCLIB'
import { WebsocketchatService } from 'websocketlib';
import { LocalstorageService } from '../service/localstorage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
@Component({
  standalone: false,
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  public msgEvent: EventEmitter<any> = new EventEmitter<any>();
  msgList: Array<any> = new Array<any>();
  msg: string;
  dataChannel: WebRTCDataChannelComponent;
  toUser: string;
  authToken: string;
  constructor(
    private websocketService: WebsocketchatService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private localstorage: LocalstorageService
  ) { }

  ngOnInit() {
    this.msgEvent.subscribe((event) => {
      this.msgList.push(JSON.parse(event.data));
    })
    this.authToken = this.localstorage.get("authToken");
    this.toUser = this.activatedRoute.snapshot.params['id'];

    var flag = this.activatedRoute.snapshot.params['flag'];

    if(flag === "call") {
      this.dataChannel = new WebRTCDataChannelComponent({
        type: 'call',
        roomID: this.websocketService.user.userId + ":" + this.toUser,
        callButtonID: 'videoCallButton',
        endButtonID: 'endCallButton'
      }, {
        wssHost: environment.signalingServer + "/" + this.authToken
      }, null);

      this.websocketService.sendMsg("@datachannel@", this.websocketService.user.userId, this.toUser)
      .then((msg: any) => {
        if (!msg) {
          this.openSnackBar("用户未登录，无法接收信息", "Dance");
          return;
        }
      }).catch((msg: any) => {
        this.openSnackBar("用户未登录，无法接收信息", "Dance");
      })
    } else if (flag === "recive") {
      this.dataChannel = new WebRTCDataChannelComponent({
        type: 'receive',
        roomID: this.toUser + ":" + this.websocketService.user.userId,
        callButtonID: 'videoCallButton',
        endButtonID: 'endCallButton'
      }, {
        wssHost: environment.signalingServer + "/" + this.authToken
      }, null);

    }

    this.dataChannel.onMessage = (event) => {
      console.log(event.data);
      this.msgEvent.emit(event);
    }
  }

  send() {
    this.dataChannel.sendData(this.msg);
    this.msgList.push(this.msg);
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

}
