import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatview',
  standalone: false,
  templateUrl: './chatview.html',
  styleUrl: './chatview.scss'
})
export class Chatview implements OnInit, AfterViewInit, OnDestroy {
  userData: any = {};
  messages: any[] = [];
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  isLoading: boolean = false;
  showScrollBtn: boolean = false;
  aiName: string = 'Wiki-Query Agent';
  conversationId: string = '';
  private queryParamsSub!: Subscription;

  private readonly API_URL = 'http://192.168.1.19:3001/agent';
  private readonly SESSION_ID = 'Samsung00';

  constructor(
    public location: Location,
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      this.userData = {
        id: params['userId'],
        name: params['userName'],
        email: params['userEmail'],
        avatar: params['userAvatar']
      };
    });

    this.initConversationId();
    this.addWelcomeMessage();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.queryParamsSub?.unsubscribe();
  }

  private initConversationId() {
    const stored = localStorage.getItem('conversationId');
    if (stored) {
      this.conversationId = stored;
    } else {
      this.conversationId = this.generateUUID();
      localStorage.setItem('conversationId', this.conversationId);
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  back() {
    this.location.back();
  }

  async send() {
    const messageText = this.messageInput.nativeElement.value.trim();
    if (messageText && !this.isLoading) {
      const htmlText = await this.parseMarkdown(messageText);
      this.messages.push({
        text: messageText,
        htmlText,
        time: this.getCurrentTime(),
        isOwn: true,
        avatar: 'assets/images/captain-america.jpg'
      });

      this.messageInput.nativeElement.value = '';
      this.isLoading = true;
      this.scrollToBottom();

      this.sendMessageToAPI(messageText);
    }
  }

  private sendMessageToAPI(chatInput: string) {
    const body = { action: 'sendMessage', sessionId: this.SESSION_ID, chatInput, conversationId: this.conversationId };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(this.API_URL, body, { headers }).subscribe({
      next: (response: any) => this.handleApiResponse(response),
      error: (error: any) => this.handleApiError(error)
    });
  }

  private async handleApiResponse(response: any) {
    this.isLoading = false;
    if (response?.output) {
      const htmlText = await this.parseMarkdown(response.output);
      this.messages.push({
        text: response.output,
        htmlText,
        time: this.getCurrentTime(),
        isOwn: false,
        avatar: this.userData.avatar || 'assets/images/winter-soldier.jpg'
      });
    } else {
      await this.addDefaultReply();
    }
    this.scrollToBottom();
  }

  private async handleApiError(error: any) {
    this.isLoading = false;
    console.error('API error:', error);
    await this.addDefaultReply();
    this.scrollToBottom();
  }

  private async addDefaultReply() {
    const text = 'Sorry, I encountered an issue. Please try again.';
    const htmlText = await this.parseMarkdown(text);
    this.messages.push({
      text,
      htmlText,
      time: this.getCurrentTime(),
      isOwn: false,
      avatar: this.userData.avatar || 'assets/images/winter-soldier.jpg'
    });
  }

  private async addWelcomeMessage() {
    const text = `你好！👋\n\n我是 **Wiki-Query 智能体**，专门负责帮你查询 **LLM Wiki 知识库**。有什么问题尽管问我！`;
    const htmlText = await this.parseMarkdown(text);
    this.messages.push({
      text,
      htmlText,
      time: '',
      isOwn: false,
      avatar: 'assets/images/winter-soldier.jpg',
      isWelcome: true
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      const el = this.chatMessages?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
        this.showScrollBtn = false;
      }
    }, 50);
  }

  onScroll() {
    const el = this.chatMessages?.nativeElement;
    if (el) {
      const threshold = 150;
      this.showScrollBtn = el.scrollHeight - el.scrollTop - el.clientHeight > threshold;
    }
  }

  handleMessageClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('copy-btn')) {
      const wrapper = target.closest('.code-block-wrapper');
      if (wrapper) {
        const code = wrapper.querySelector('code')?.textContent || '';
        navigator.clipboard.writeText(code).then(() => {
          target.textContent = 'Copied!';
          setTimeout(() => { target.textContent = 'Copy'; }, 2000);
        });
      }
    }
  }

  private async parseMarkdown(text: string): Promise<SafeHtml> {
    const processed = text.replace(/\[\[([^\]]+)\]\]/g, (_match, page: string) => {
      const trimmed = page.trim();
      const slug = trimmed.replace(/\s+/g, '-');
      return `<a href="http://192.168.1.19:3000/${slug}" target="_blank" rel="noopener" class="wikilink">${trimmed}</a>`;
    });
    const html = await marked.parse(processed);
    const withCopyButtons = html.replace(
      /<pre><code/g,
      '<div class="code-block-wrapper"><button class="copy-btn">Copy</button><pre><code'
    ).replace(
      /<\/code><\/pre>/g,
      '</code></pre></div>'
    );
    return this.sanitizer.bypassSecurityTrustHtml(withCopyButtons);
  }

  private getCurrentTime(): string {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
}
