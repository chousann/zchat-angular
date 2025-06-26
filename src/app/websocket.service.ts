import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
export class WebsocketService {

  constructor(
    // private loadingController: LoadingController
  ) {
    console.log('websocket service');
  }

  
}
