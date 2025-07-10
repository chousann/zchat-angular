import { Component, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  isLoading: boolean = false;
  
  // API配置
  private readonly API_URL = 'https://n8n.cnss.eu.org/webhook/5e56a263-3a40-44bd-bc9d-1cfb3bc2a87d/chat';
  private readonly SESSION_ID = 'a0a2ba7e-bb4f-4a8b-8e46-b554cb81e90c';

  constructor(
    public location: Location,
    private route: ActivatedRoute,
    private http: HttpClient
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
    if (messageText && !this.isLoading) {
      const newMessage = {
        text: messageText,
        time: this.getCurrentTime(),
        isOwn: true,
        avatar: 'assets/images/captain-america.jpg' // 当前用户的头像
      };

      this.messages.push(newMessage);
      this.messageInput.nativeElement.value = '';
      this.isLoading = true;

      // 调用API服务
      this.sendMessageToAPI(messageText);
    }
  }

  private sendMessageToAPI(chatInput: string) {
    const requestBody = {
      action: "sendMessage",
      sessionId: this.SESSION_ID,
      chatInput: chatInput
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post(this.API_URL, requestBody, { headers })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          // 处理API响应
          if (response && response.output) {
            const replyMessage = {
              text: response.output,
              time: this.getCurrentTime(),
              isOwn: false,
              avatar: this.userData.avatar || 'assets/images/winter-soldier.jpg'
            };
            this.messages.push(replyMessage);
          } else {
            // 如果API没有返回有效响应，使用默认回复
            this.addDefaultReply();
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('API调用失败:', error);
          // API调用失败时，使用默认回复
          this.addDefaultReply();
        }
      });
  }

  private addDefaultReply() {
    const replyMessage = {
      text: '收到你的消息了！',
      time: this.getCurrentTime(),
      isOwn: false,
      avatar: this.userData.avatar || 'assets/images/winter-soldier.jpg'
    };
    this.messages.push(replyMessage);
  }

  private getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

}
