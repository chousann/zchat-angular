import { NgModule } from '@angular/core';
import { Websocketlib } from './websocketlib';
import { WebsocketchatlibComponent } from './websocketchatlib.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    Websocketlib,
    WebsocketchatlibComponent
  ],
  imports: [
    HttpClientModule
  ],
  exports: [
    Websocketlib,
    WebsocketchatlibComponent
  ]
})
export class WebsocketlibModule { }
