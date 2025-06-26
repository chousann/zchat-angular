import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
@Injectable({
  providedIn: 'root'
})
export class WebsocketchatService {


  configUrl: string = 'http://localhost:1000/';
  webSocketurl: string = 'ws://localhost:1000/';
  initUrl: string = this.configUrl + 'init';
  loginUrl: string = this.configUrl + 'login';
  logoutUrl: string = this.configUrl + 'logout';
  oneTonemsgUrl: string = this.configUrl + 'oneTone';
  oneTmanymsgUrl: string = this.configUrl + 'oneTmany';
  usersUrl: string = this.configUrl + 'users';
  websocketUrl: string = this.webSocketurl + "test-one";
  websocket: WebSocket;
  public user: User;


  public close: EventEmitter<any> = new EventEmitter<any>();
  public error: EventEmitter<any> = new EventEmitter<any>();
  public message: EventEmitter<any> = new EventEmitter<any>();
  public open: EventEmitter<any> = new EventEmitter<any>();

  // "close": CloseEvent;
  // "error": Event;
  // "message": MessageEvent;
  // "open": Event;
  constructor(private http: HttpClient) { }

  initializeApp(config: {url: string, socketurl: string}) {
    this.configUrl = config.url;
    this.webSocketurl = config.socketurl;
    this.initUrl = this.configUrl + 'init';
    this.loginUrl = this.configUrl + 'login';
    this.logoutUrl = this.configUrl + 'logout';
    this.oneTonemsgUrl = this.configUrl + 'oneTone';
    this.oneTmanymsgUrl = this.configUrl + 'oneTmany';
    this.usersUrl = this.configUrl + 'users';
    this.websocketUrl = this.webSocketurl + "test-one";
  }

  signInWithUserNameAndPassword(userName: string, password: string): Promise<Object> {

    return this.http.get(this.loginUrl + '?userName=' + userName + '&password=' + password).toPromise()
      .then(async (authData: User) => {
        if (authData) {
          this.user = authData;
          await this.wsconnect(authData.authToken);
          return authData;
        }
        return null;
      });
  }

  wsconnect = async (authToken: string) => {
    this.websocket = await new WebSocket(this.websocketUrl + "/" + authToken);

    this.websocket.onopen = this.onopen;
    this.websocket.onclose = this.onclose;
    this.websocket.onmessage = this.onmessage;
    this.websocket.onerror = this.onerror;
  }

  signOut(): Promise<Object> {
    return this.http.get(this.logoutUrl).toPromise();
  }

  onopen = (ev: Event) => {
    console.log("onpen");
    this.open.emit(ev);
    return ev;
  }

  onerror = (ev: Event) => {
    console.log(ev);
    this.close.emit(ev);
  }

  onclose = (ev: CloseEvent) => {
    console.log(ev);
    this.close.emit();
  }

  onmessage = (ev: MessageEvent) => {
    console.log(ev);
    this.message.emit(ev);
  }

  getUsers() : Promise<Array<Object>>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get<Array<Object>>(this.usersUrl + '?AuthToken=' + this.user.authToken).toPromise();
  }

  getInitInfo(token: string) : Promise<Object>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get<Object>(this.initUrl + '?AuthToken=' + token).toPromise()
    .then(async (authData: User) => {
      if (authData) {
        this.user = authData;
        await this.wsconnect(authData.authToken);
        return authData;
      }
      return null;
    });
  }

  sendMsg(msg: string, fromUser: string, toUser: string) : Promise<Object>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get(this.oneTonemsgUrl + "?fromId=" + fromUser + "&context=" + msg + "&toId=" + toUser + '&AuthToken=' + this.user.authToken).toPromise();
  }

  sendAllMsg(msg: string, fromUser: string) : Promise<Object>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get(this.oneTmanymsgUrl + 	"?fromId=" + fromUser + "&context=" + msg + '&AuthToken=' + this.user.authToken).toPromise();
  }

  createUserWithEmailAndPassword(userName: string, password: string) : Promise<Object>{
    return this.http.get(this.oneTmanymsgUrl + '?context=' + userName).toPromise();
  }

  updateProfile(userName: string, password: string) : Promise<Object>{
    return this.http.get(this.oneTmanymsgUrl + '?context=' + userName).toPromise();
  }

  onUsers() {

  }

  addfriend(): Promise<Object>{
    return this.http.get(this.oneTmanymsgUrl + '?context=').toPromise(); 
  }

  joinRoom(): Promise<Object>{
    return this.http.get(this.oneTmanymsgUrl + '?context=').toPromise();
  }
}
