import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebRTCComponent } from 'webrtclib'
import { WebsocketchatService } from 'websocketlib';
import { LocalstorageService } from '../service/localstorage.service';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  standalone: false,
  selector: 'app-webrtc',
  templateUrl: './webrtc.component.html',
  styleUrls: ['./webrtc.component.scss']
})
export class WebrtcComponent implements OnInit {

  toUser: string;
  windowState: string = 'restored';
  remoteWindowState: string = 'restored';
  localWindowState: string = 'restored';
  authToken: string;
  constructor(
    private websocketService: WebsocketchatService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private localstorage: LocalstorageService
  ) { }

  ngOnInit() {
    this.authToken = this.localstorage.get("authToken");
    this.toUser = this.activatedRoute.snapshot.params['id'];

    var flag = this.activatedRoute.snapshot.params['flag'];

    if(flag === "call") {
      var a = new WebRTCComponent({
        type: 'call',
        roomID: this.websocketService.user.userId + ":" + this.toUser,
        callButtonID: 'videoCallButton',
        endButtonID: 'endCallButton',
        localStreamID: 'local',
        remoteStreamID: 'remote'
      }, {
        wssHost: environment.signalingServer + "/" + this.authToken
      }, null);

      this.websocketService.sendMsg("@video@", this.websocketService.user.userId, this.toUser)
      .then((msg: any) => {
        if (!msg) {
          this.openSnackBar("用户未登录，无法接收信息", "Dance");
          return;
        }
      }).catch((msg: any) => {
        this.openSnackBar("用户未登录，无法接收信息", "Dance");
      })
    } else if (flag === "recive") {
      var a = new WebRTCComponent({
        type: 'receive',
        roomID: this.toUser + ":" + this.websocketService.user.userId,
        callButtonID: 'videoCallButton',
        endButtonID: 'endCallButton',
        localStreamID: 'local',
        remoteStreamID: 'remote'
      }, {
        wssHost: environment.signalingServer + "/" + this.authToken
      }, null);

    }
  }

  back() {
    this.router.navigate(['/tabs']);
  }

  // 远端窗口控制
  minimizeRemote() {
    this.remoteWindowState = 'minimized';
  }
  restoreRemote() {
    this.remoteWindowState = 'restored';
  }
  toggleRemoteFullscreen(event: Event) {
    if (this.remoteWindowState !== 'fullscreen') {
      this.remoteWindowState = 'fullscreen';
      const el = (event.target as HTMLElement).closest('.video-box');
      if (el && el.requestFullscreen) {
        el.requestFullscreen();
      }
    } else {
      this.remoteWindowState = 'restored';
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // 本地窗口控制
  minimizeLocal() {
    this.localWindowState = 'minimized';
  }
  restoreLocal() {
    this.localWindowState = 'restored';
  }
  toggleLocalFullscreen(event: Event) {
    if (this.localWindowState !== 'fullscreen') {
      this.localWindowState = 'fullscreen';
      const el = (event.target as HTMLElement).closest('.video-box');
      if (el && el.requestFullscreen) {
        el.requestFullscreen();
      }
    } else {
      this.localWindowState = 'restored';
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, null, {
      duration: 3000,
      verticalPosition: "top"
    });
  }

}
