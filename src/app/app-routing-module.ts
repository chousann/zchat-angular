import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallsComponent } from './calls/calls.component';
import { ChatComponent } from './chat/chat.component';
import { AnttabsComponent } from './common/anttabs/anttabs.component';
import { TabsComponent } from './common/tabs/tabs.component';
import { DataComponent } from './datachannel/data.component';
import { LoginComponent } from './login/login.component';
import { OAuthComponent } from './oauth/oauth.component';
import { SelectuserComponent } from './selectuser/selectuser.component';
import { WebrtcComponent } from './webrtc/webrtc.component';
import { Chat } from './chat/chat';
import { Chatview } from './chatview/chatview';

const routes: Routes = [
  {
    path: 'aouth', component: OAuthComponent
  },{
    path: 'login', component: LoginComponent
  },{
    path: 'chat', component: ChatComponent
  },{
    path: 'users', component: SelectuserComponent
  },{
    path: 'anttabs', component: AnttabsComponent
  },{
    path: 'tabs', component: TabsComponent
  },{
    path: 'webrtc', component: WebrtcComponent
  },{
    path: 'datachannel', component: DataComponent
  },{
    path: 'rtcdatachannel', component: CallsComponent
  },{
    path: 'chatbox', component: Chat
  },{
    path: 'chatview', component: Chatview
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
