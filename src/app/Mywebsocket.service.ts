import { Injectable } from '@angular/core';
import { WebsocketchatService } from 'websocketlib';
import { WebsocketService } from './websocket.service';
const firebaseConfig = {
  apiKey: "AIzaSyCdi_DUL90xrv2ACCad5SNjY9d84iY7j7c",
  authDomain: "hellofirebase-76124.firebaseapp.com",
  databaseURL: "https://hellofirebase-76124.firebaseio.com",
  projectId: "hellofirebase-76124",
  storageBucket: "",
  messagingSenderId: "1025357322276",
  appId: "1:1025357322276:web:d112b29f37746d31ea60b1"
};
@Injectable({
  providedIn: 'root'
})
export class MywebsocketService extends WebsocketService {

  constructor(private websocketchatService: WebsocketchatService) {
    super();
    console.log('my websocket service');
    //this.init();
  }

  init() {
    // this.websocketchatService.initializeApp({url: 'http://localhost:1000/'});
  }
  onAuthStateChanged(callback) {
    console.log('close');
    this.websocketchatService.onclose = callback;
  }

  login(user: string, password: string): Promise<any> {

    return this.websocketchatService.signInWithUserNameAndPassword(user, password)
      .then(authData => {
        console.log('websocket impl');
        return authData;
      });
  }

  logout(): Promise<any> {
    return this.websocketchatService.signOut().then(authData => {
      return authData;
    });
  }

  // logginwithgoogle(): Promise<any> {
  //   let provider = new firebase.auth.GoogleAuthProvider();
  //   firebase.auth().signInWithRedirect(provider);
  //   return firebase.auth().getRedirectResult().then(function (result) {
  //     return result;
  //   });
  // }

  async signup(user: string, password: string): Promise<any> {
    return this.websocketchatService.createUserWithEmailAndPassword(user, password)
      .then(authData => {
        // return firebase.database().ref('/users/' + authData.user.uid).set({
        //   displayName: authData.user.displayName,
        //   photoURL: authData.user.photoURL
        // })
        //   .then(data => {
        //     return data;
        //   });
        console.log(authData);
      });
  }

  updateDetailinfo(displayName: string, photoURL: string): Promise<any> {
    return this.websocketchatService.updateProfile(
      'displayName',
      'photoURL'
    );
      // .then(() => {
      //   return firebase.database().ref('/users/' + firebase.auth().currentUser.uid).set({
      //     displayName: displayName,
      //     photoURL: photoURL
      //   });
      // });
  }

  onUsers(callback) {

    this.websocketchatService.onUsers = callback;
    // let currentUser = firebase.auth().currentUser.uid;
    // firebase.database().ref('/users').on('value', callback);
  }

  addfriend(user: any): Promise<any> {
    return this.websocketchatService.addfriend();
    // return firebase.database().ref('/friends/' + firebase.auth().currentUser.uid + '/' + user.key).set({
    //   uid: user.key
    // })
    //   .then(data => {
    //     return firebase.database().ref('/friends/' + user.key + '/' + firebase.auth().currentUser.uid).set({
    //       uid: firebase.auth().currentUser.uid
    //     })
    //   });
  }

  create(id: string, name: string, photoURL: string): Promise<any> {
    return this.websocketchatService.createUserWithEmailAndPassword(name, photoURL);
    // let db;
    // db = firebase.database();
    // return db.ref('/rooms/' + id).set({
    //   name: name,
    //   photoURL: photoURL
    // })
    //   .then(data => {
    //     db.ref('/users/' + firebase.auth().currentUser.uid + '/rooms/' + id).set({
    //       name: name,
    //       photoURL: photoURL
    //     })
    //   });
  }

  onRooms(callback) {
    this.websocketchatService.onmessage = callback;
    // let currentUser = firebase.auth().currentUser.uid;
    // firebase.database().ref('/rooms').on('value', callback);
  }

  joinRoom(room: any): Promise<any> {
    return this.websocketchatService.joinRoom();
    // return firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/rooms/' + room.key).set({
    //   name: room.name,
    //   photoURL: room.photoURL
    // });
  }

  getcurrentUser() {

    return null;
    // let c = firebase.auth().currentUser;
    // return {uid: c.uid, displayName: c.displayName, photoURL: c.photoURL, email: c.email};
  }

  onfriendMessage(id: string, callback) {
    this.websocketchatService.onmessage = callback;
    // let currentUsr = firebase.auth().currentUser.uid;
    // let currentUsrphoto = firebase.auth().currentUser.photoURL;
    // firebase.database().ref('/friendmessages/' + currentUsr + '/' + id).on('value', callback);
  }

  send(id: string, message: string): Promise<any> {
    return this.websocketchatService.sendAllMsg(message, null);
    // let currentUsr = firebase.auth().currentUser.uid;
    // const time = new Date();
    // return firebase.database().ref('/friendmessages/' + currentUsr + '/' + id).push({
    //   userId: firebase.auth().currentUser.uid,
    //   name: firebase.auth().currentUser.email,
    //   message: message,
    //   time: time
    // })
    //   .then(data => {
    //     return firebase.database().ref('/friendmessages/' + id + '/' + currentUsr).push({
    //       userId: firebase.auth().currentUser.uid,
    //       name: firebase.auth().currentUser.email,
    //       message: message,
    //       time: time
    //     });
    //   });
  }

  onMessages(id: string, callback) {
    this.websocketchatService.onmessage = callback;
    // let currentUsr = firebase.auth().currentUser.uid;
    // firebase.database().ref('/messages/' + id + '/messageList').on('value', callback);
  }

  roomsend(id: string, message: string): Promise<any> {

    return this.websocketchatService.sendAllMsg(message, null);
    // const time = new Date();
    // return firebase.database().ref('/messages/' + id + '/messageList').push({
    //   userId: firebase.auth().currentUser.uid,
    //   name: firebase.auth().currentUser.email,
    //   message: message,
    //   time: time
    // });
  }

  onMyRooms(callback) {

    this.websocketchatService.onmessage = callback;
    // let currentUser = firebase.auth().currentUser.uid;
    // firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/rooms').on('value', callback);
  }

  onMyFriends(callback) {
    this.websocketchatService.onmessage = callback;
    // let currentUser = firebase.auth().currentUser.uid;
    // let friendList = [];
    // firebase.database().ref('/friends/' + firebase.auth().currentUser.uid).on('value', snapshot => {
    //   let rawList = [];
    //   firebase.database().ref('/users').once('value', users => {
    //     snapshot.forEach(snap => {
    //       rawList.push({
    //         key: snap.key,
    //         name: users.child(snap.key).val().displayName,
    //         photoURL: users.child(snap.key).val().photoURL,
    //       });
    //       return false
    //     });
    //     friendList = rawList;
    //     callback(friendList);
    //   });
    // });
  }

  messageNotifications(uid: string, callback) {

    this.websocketchatService.onmessage = callback;
    // firebase.database().ref('/users/' + uid + '/rooms').on('value', snapshot => {
    //   let rawList = [];
    //   snapshot.forEach(snap => {
    //     firebase.database().ref('/messages/' + snap.key + '/messageList').on('value', snapshot => {
    //       let rawList = [];
    //       callback()
    //     })
    //     return false
    //   });
    // });
    // firebase.database().ref('/friendmessages/' + uid).on('value', snapshot => {
    //   callback();
    // });
  }
}
