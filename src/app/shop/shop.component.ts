import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
    this.addItems(0);
  }

  value: string = '美食';
  autoFocus = {
    focusValue: true
  };
  focusObj = {
    focusValue: false,
    date: new Date()
  };

  change($event) {
    console.log($event, 'onChange');
  }

  submit(value) {
    console.log(value, 'onSubmit');
  }

  clear(value) {
    console.log(value, 'onClear');
  }

  focus() {
    console.log('onFocus');
  }

  blur() {
    console.log('onBlur');
  }

  cancel() {
    console.log('onCancel');
  }

  handleClick() {
    this.focusObj = {
      focusValue: true,
      date: new Date()
    };
  }

  /////

  winstate = {
    data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
    imgHeight: '184px'
  };

  beforeChange(event) {
    console.log('slide ' + event.from + ' to ' + event.to);
  }

  afterChange(event) {
    console.log('slide to ' + event);
  }


  isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(window.navigator.userAgent);
  pageLimit = 20;
  public directionCount = 0;
  page = 0;
  state = {
    refreshState: {
      currentState: 'deactivate',
      drag: false
    },
    direction: 'up',
    endReachedRefresh: false,
    height: '100%',
    data: [],
    directionName: 'up'
  };
  dtPullToRefreshStyle = { height: this.state.height };

  pullToRefresh(event) {
    if (event === 'endReachedRefresh') {
        if (this.page < 9) {
          this.page++;
          this.addItems(this.page * this.pageLimit);
          this.state.refreshState.currentState = 'release';
          setTimeout(() => {
            this.state.refreshState.currentState = 'finish';
          }, 1000);
        }
    } else {
       if (event === 'down') {
        this.state.data = [];
        this.page = 0;
        this.addItems(0);
      } else {
        if (this.page < 9) {
          this.page++;
          this.addItems(this.page * this.pageLimit);
        }
      }
    }
  }

  addItems(startIndex) {
    for (let i = startIndex; i < this.pageLimit * (this.page + 1); i++) {
      this.state.data.push(i);
    }
  }

  genData() {
    const dataArr = [];
    for (let i = 0; i < 100; i++) {
      dataArr.push(i);
    }
    return dataArr;
  }

}
