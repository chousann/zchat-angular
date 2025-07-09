import { Component, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chatview',
  standalone: false,
  templateUrl: './chatview.html',
  styleUrl: './chatview.scss'
})
export class Chatview {
  userData: any = {};
  messages: any[] = [];
  @ViewChild('messageInput') messageInput!: ElementRef;

  constructor(
    public location: Location,
    private route: ActivatedRoute
  ) {
    // Get user data from query parameters
    this.route.queryParams.subscribe(params => {
      this.userData = {
        id: params['userId'],
        name: params['userName'],
        email: params['userEmail'],
        avatar: params['userAvatar']
      };
    });
  }

  back() {
    this.location.back();
  }

  send() {
    const messageText = this.messageInput.nativeElement.value.trim();
    if (messageText) {
      const newMessage = {
        text: messageText,
        time: this.getCurrentTime(),
        isOwn: true,
        avatar: 'assets/images/captain-america.jpg' // 当前用户的头像
      };
      
      this.messages.push(newMessage);
      this.messageInput.nativeElement.value = '';
      
      // 模拟对方回复
      setTimeout(() => {
        const replyMessage = {
          text: '收到你的消息了！',
          time: this.getCurrentTime(),
          isOwn: false,
          avatar: this.userData.avatar || 'assets/images/winter-soldier.jpg'
        };
        this.messages.push(replyMessage);
      }, 1000);
    }
  }

  private getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

}
