import { NgModule, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CallsComponent } from './calls/calls.component';
import { ChatComponent } from './chat/chat.component';
import { AnttabsComponent } from './common/anttabs/anttabs.component';
import { LoadingComponent } from './common/loading/loading.component';
import { SnackbarComponent } from './common/snackbar/snackbar.component';
import { TabsComponent } from './common/tabs/tabs.component';
import { DataComponent } from './datachannel/data.component';
import { LoginComponent } from './login/login.component';
import { MyComponent } from './my/my.component';
import { OAuthComponent } from './oauth/oauth.component';
import { SelectuserComponent } from './selectuser/selectuser.component';
import { ShopComponent } from './shop/shop.component';
import { TabComponent } from './tab/tab.component';
import { WebrtcComponent } from './webrtc/webrtc.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { environment } from '../environments/environment.prod';
import { LocalstorageService } from './service/localstorage.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WebsocketchatService, WebsocketlibModule } from 'websocketlib';
import { ServiceWorkerModule, SwRegistrationOptions } from '@angular/service-worker';
import { Chat } from './chat/chat';
import { Chatview } from './chatview/chatview';

@NgModule({
  declarations: [
    App,
    LoginComponent,
    LoadingComponent,
    ChatComponent,
    SelectuserComponent,
    TabsComponent,
    TabComponent,
    AnttabsComponent,
    SnackbarComponent,
    ShopComponent,
    MyComponent,
    WebrtcComponent,
    OAuthComponent,
    DataComponent,
    CallsComponent,
    Chat,
    Chatview
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    WebsocketlibModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatSidenavModule,
    MatBadgeModule,
    DragDropModule,
    MatExpansionModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    WebsocketchatService, LocalstorageService
  ],
  bootstrap: [App]
  // entryComponents:[
  //   LoadingComponent
  // ]
})
export class AppModule { }
