import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsocketchatService } from 'websocketlib';
import { LocalstorageService } from '../service/localstorage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
@Component({
  standalone: false,
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  rtcDataChannel: RTCDataChannel;

  public msgEvent: EventEmitter<any> = new EventEmitter<any>();
  msgList: Array<any> = new Array<any>();
  msg: string;
  toUser: string;
  authToken: string;
  constructor(
    private websocketService: WebsocketchatService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private localstorage: LocalstorageService
  ) { }

  async ngOnInit() {
    this.msgEvent.subscribe((event) => {
      this.msgList.push(JSON.parse(event.data));
    })
    this.authToken = this.localstorage.get("authToken");
    this.toUser = this.activatedRoute.snapshot.params['id'];

    var flag = this.activatedRoute.snapshot.params['flag'];

    if (flag === "call") {
      this.call();
    } else if (flag === "recive") {
      this.receive();
    }

  }

  async call() {
    var headers = {
      Authorization: `Bearer ${environment.APP_TOKEN}`,
    };

    var session = await this.createCallsSession()

    var channel1resp = await fetch(
      environment.API_BASE + environment.APP_ID + "/sessions/" + session.sessionId + "/datachannels/new",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          dataChannels: [
            {
              location: "local",
              dataChannelName: "channel-one",
            },
          ],
        }),
      }
    ).then((res) => res.json());

    this.rtcDataChannel = session.peerConnection.createDataChannel(
      "channel-one",
      {
        negotiated: true,
        id: channel1resp.dataChannels[0].id,
      }
    );

    this.rtcDataChannel.onmessage = (event) => {
      console.log(event.data);
      this.msgEvent.emit(event);
    }

    this.websocketService.sendMsg("@rtcdatachannel@" + session.sessionId, this.websocketService.user.userId, this.toUser)
      .then((msg: any) => {
        if (!msg) {
          this.openSnackBar("用户未登录，无法接收信息", "Dance");
          return;
        }
      }).catch((msg: any) => {
        this.openSnackBar("用户未登录，无法接收信息", "Dance");
      })
    console.log(session.sessionId);
  }

  async receive() {
    var headers = {
      Authorization: `Bearer ${environment.APP_TOKEN}`,
    };

    var session = await this.createCallsSession()

    var receivedSessionId = this.activatedRoute.snapshot.params['sessionId'];;

    var channel1resp = await fetch(
      environment.API_BASE + environment.APP_ID + "/sessions/" + session.sessionId + "/datachannels/new",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          dataChannels: [
            {
              location: "remote",
              sessionId: receivedSessionId,
              dataChannelName: "channel-one",
            }
          ],
        }),
      }
    ).then((res) => res.json());

    this.rtcDataChannel = session.peerConnection.createDataChannel(
      "channel-one",
      {
        negotiated: true,
        id: channel1resp.dataChannels[0].id,
      }
    );

    this.rtcDataChannel.onmessage = (event) => {
      console.log(event.data);
      this.msgEvent.emit(event);
    }

  }

  send() {
    this.rtcDataChannel.send(this.msg);
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


  async createCallsSession() {
    var peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.cloudflare.com:3478",
        },
      ],
      bundlePolicy: "max-bundle",
    });

    // in order for the ICE connection to be established, there must
    // be at least one track present, but since we want each peer
    // connection and session to have tracks explicitly pushed and
    // pulled, we can add an empty audio track here to force the
    // connection to be established.
    peerConnection.addTransceiver("audio", {
      direction: "inactive",
    });

    var dc = peerConnection.createDataChannel("server-events");

    // create an offer and set it as the local description
    await peerConnection.setLocalDescription(
      await peerConnection.createOffer()
    );
    var headers = {
      Authorization: `Bearer ${environment.APP_TOKEN}`,
    };
    var { sessionId, sessionDescription } = await fetch(
      `${environment.API_BASE}${environment.APP_ID}/sessions/new`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          sessionDescription: peerConnection.localDescription,
        }),
      }
    ).then((res) => res.json());
    // var connected = new Promise((res, rej) => {
    //   // timeout after 5s
    //   setTimeout(rej, 5000);
    //   var iceConnectionStateChangeHandler = () => {
    //     if (peerConnection.iceConnectionState === "connected") {
    //       peerConnection.removeEventListener(
    //         "iceconnectionstatechange",
    //         iceConnectionStateChangeHandler
    //       );
    //       res(undefined);
    //     }
    //   };
    //   peerConnection.addEventListener(
    //     "iceconnectionstatechange",
    //     iceConnectionStateChangeHandler
    //   );
    // });

    // Once both local and remote descriptions are set, the ICE process begins
    await peerConnection.setRemoteDescription(sessionDescription);
    // Wait until the peer connection's iceConnectionState is "connected"
    // await connected;
    return {
      peerConnection,
      sessionId,
      dc,
    };
  }

}
