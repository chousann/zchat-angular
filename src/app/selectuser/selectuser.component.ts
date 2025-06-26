import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketchatService } from 'websocketlib';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalstorageService } from '../service/localstorage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  standalone: false,
  selector: 'app-selectuser',
  templateUrl: './selectuser.component.html',
  styleUrls: ['./selectuser.component.scss']
})
export class SelectuserComponent implements OnInit, OnDestroy {

  userList: Array<any> = new Array<any>();
  subscription: Subscription;
  constructor(
    private router: Router,
    private websocketService: WebsocketchatService,
    private snackBar: MatSnackBar,
    private localstorage: LocalstorageService,
  ) { }

  ngOnInit() {
    this.websocketService.getUsers()
      .then((data: Array<any>) => {
        data.forEach((element: any) => {
          if(element.userName != this.websocketService.user.userName) {
            element.num = this.localstorage.get(this.websocketService.user.authToken + element.authToken + 'noread');

            element.num = element.num ? element.num : null;
            this.userList.push(element);
          }
        });
      })

      this.subscription = this.localstorage.msgEvent.subscribe((msg) => {
        let wraplist: Array<any> = new Array<any>();
        this.userList.forEach((element: any) => {
          if(msg.fromId === element.authToken) {
            let num = this.localstorage.get(this.websocketService.user.authToken + element.authToken + 'noread');
            element.num = num ? num : null;
          }
          wraplist.push(element)
        });
        this.userList = wraplist;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  select(user: any) {
    this.router.navigate(['/chat', { id: user.userId, name: user.userName}]);
  }

  right = [
    {
      text: '删除',
      onPress: () => this.openSnackBar('删除', null),
      className: 'btnClass'
    }
  ];

  left = [
    {
      text: '置顶',
      onPress: () => this.openSnackBar('置顶', null),
      style: { backgroundColor: '#108ee9', color: 'white' }
    }
  ];

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, null, {
      duration: 1000,
      verticalPosition: "top"
    });
  }

  open() {
    console.log('open');
  }

  close() {
    console.log('close');
  }
}
