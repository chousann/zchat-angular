import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../../service/localstorage.service';
import { WebsocketchatService } from 'websocketlib';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  standalone: false,
  selector: 'app-anttabs',
  templateUrl: './anttabs.component.html',
  styleUrls: ['./anttabs.component.scss']
})
export class AnttabsComponent implements OnInit {

  constructor(
    private localstorage: LocalstorageService,
    private snackBar: MatSnackBar,
    private websocketService: WebsocketchatService,
  ) { }

  ngOnInit() {
  }

  hidden: boolean = false;
  fullScreen: boolean = true;
  topFlag: boolean = false;
  tintColor: string = '#108ee9';
  unselectedTintColor: string = '#888';
  tabbarStyle: object = {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top: 0
  };
  selectedIndex: number = 0;

  showTabBar(event) {
    event.preventDefault();
    this.hidden = !this.hidden;
  }

  showNextTabBar(event) {
    event.preventDefault();
    const PANE_COUNT = 4;
    if (this.selectedIndex == PANE_COUNT - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
    console.log('selectedIndex: ', this.selectedIndex);
  }

  showFullScreen(event) {
    event.preventDefault();
    this.fullScreen = !this.fullScreen;
    this.tabbarStyle = this.fullScreen
      ? {
          position: 'fixed',
          height: '100%',
          width: '100%',
          top: 0
        }
      : { height: '400px' };
  }

  changePosition(event) {
    event.preventDefault();
    this.topFlag = !this.topFlag;
  }

  tabBarTabOnPress(pressParam: any) {
    console.log('onPress Params: ', pressParam);
    this.selectedIndex = pressParam.index;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, null, {
      duration: 3000,
      verticalPosition: "top"
    });
  }

}
