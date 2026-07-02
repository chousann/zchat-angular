import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { Subscription } from 'rxjs';

interface FeedbackStep {
  type: 'thinking' | 'tool_call' | 'tool_result';
  content: string;
  htmlContent?: SafeHtml;
}

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
  isThinking: boolean = false;
  /** Current feedback status label shown during streaming (e.g. "Thinking…", "Calling tool…") */
  feedbackStatus: string = '';
  private queryParamsSub!: Subscription;
  /** Tracks all in-flight streams so ngOnDestroy can abort them; the client never aborts proactively. */
  private abortControllers = new Set<AbortController>();

  private readonly API_URL = 'http://localhost:3001/agent';
  private readonly SESSION_ID = 'Samsung00';

  constructor(
    public location: Location,
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private ngZone: NgZone
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
    this.abortControllers.forEach(c => c.abort());
    this.abortControllers.clear();
  }

  private initConversationId() {
    const stored = null;//localStorage.getItem('conversationId');
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

  /** Toggle feedback panel expanded/collapsed */
  toggleFeedback(message: any) {
    message.feedbackExpanded = !message.feedbackExpanded;
  }

  /** Get a short summary label for the feedback steps */
  getFeedbackSummary(steps: FeedbackStep[]): string {
    if (!steps || steps.length === 0) return '';
    const counts: Record<string, number> = {};
    for (const s of steps) {
      const label = s.type === 'thinking' ? 'Thinking' : s.type === 'tool_call' ? 'Tool Call' : 'Result';
      counts[label] = (counts[label] || 0) + 1;
    }
    return Object.entries(counts).map(([k, v]) => `${k}${v > 1 ? ` ×${v}` : ''}`).join(' · ');
  }

  async send() {
    const messageText = this.messageInput.nativeElement.value.trim();
    if (!messageText) return;

    const htmlText = await this.parseMarkdown(messageText);
    this.messages.push({
      text: messageText,
      htmlText,
      time: this.getCurrentTime(),
      isOwn: true,
      avatar: 'assets/images/captain-america.jpg'
    });

    this.messageInput.nativeElement.value = '';
    this.scrollToBottom();

    this.sendMessageToAPI(messageText);
  }

  private async sendMessageToAPI(chatInput: string) {
    const controller = new AbortController();
    this.abortControllers.add(controller);
    const body = { action: 'sendMessage', sessionId: this.SESSION_ID, chatInput, conversationId: this.conversationId, mode: 'sse' };

    // Per-stream local state (concurrent streams must not share this)
    let streamingText = '';
    let currentEvent = '';
    let buffer = '';

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessageIndex = -1;

      // Add a placeholder message for streaming
      this.ngZone.run(() => {
        this.messages.push({
          text: '',
          htmlText: '',
          time: this.getCurrentTime(),
          isOwn: false,
          avatar: this.userData.avatar || 'assets/images/winter-soldier.jpg',
          isStreaming: true,
          isThinkingMsg: true,
          feedbackStatus: 'Thinking…',
          feedbackExpanded: false,
          feedbackSteps: [] as FeedbackStep[]
        });
        aiMessageIndex = this.messages.length - 1;
        this.recomputeState();
        this.scrollToBottom();
      });

      const getMsg = () => (aiMessageIndex >= 0 && aiMessageIndex < this.messages.length) ? this.messages[aiMessageIndex] : null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Stream ended — finalize the message (remove streaming cursor)
          this.ngZone.run(async () => {
            const msg = getMsg();
            if (msg) {
              msg.isStreaming = false;
              msg.isThinkingMsg = false;
              msg.htmlText = await this.parseMarkdown(streamingText, false);
              for (const step of msg.feedbackSteps) {
                if (step.content) {
                  step.htmlContent = await this.parseInlineMarkdown(step.content);
                }
              }
            }
            this.recomputeState();
            this.scrollToBottom();
          });
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events from buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            const rawData = line.slice(6);
            let data: any;
            try { data = JSON.parse(rawData); } catch { currentEvent = ''; continue; }

            // --- Feedback types: response=null, thinking has value ---
            if (currentEvent === 'thinking') {
              this.ngZone.run(() => {
                const msg = getMsg();
                if (msg) {
                  msg.isThinkingMsg = true;
                  msg.feedbackStatus = 'Thinking…';
                  if (data.thinking) {
                    msg.feedbackSteps.push({
                      type: 'thinking',
                      content: typeof data.thinking === 'string' ? data.thinking : JSON.stringify(data.thinking)
                    });
                  }
                }
                this.recomputeState();
              });
            } else if (currentEvent === 'tool_call') {
              this.ngZone.run(() => {
                const msg = getMsg();
                if (msg) {
                  msg.isThinkingMsg = true;
                  msg.feedbackStatus = 'Calling tool…';
                  msg.feedbackSteps.push({
                    type: 'tool_call',
                    content: typeof data.thinking === 'string' ? data.thinking : JSON.stringify(data.thinking ?? '')
                  });
                }
                this.recomputeState();
              });
            } else if (currentEvent === 'tool_result') {
              this.ngZone.run(() => {
                const msg = getMsg();
                if (msg) {
                  msg.isThinkingMsg = true;
                  msg.feedbackStatus = 'Tool returned';
                  msg.feedbackSteps.push({
                    type: 'tool_result',
                    content: typeof data.thinking === 'string' ? data.thinking : JSON.stringify(data.thinking ?? '')
                  });
                }
                this.recomputeState();
              });

            // --- Interaction types: response has value, thinking=null ---
            } else if (currentEvent === 'final_result' || currentEvent === 'ask_user' || currentEvent === 'error') {
              const text = typeof data.response === 'string' ? data.response : '';
              this.ngZone.run(async () => {
                streamingText += text;
                const msg = getMsg();
                if (msg) {
                  msg.isThinkingMsg = false;
                  msg.text = streamingText;
                  msg.htmlText = await this.parseMarkdown(streamingText, true);
                }
                this.recomputeState();
                this.scrollToBottom();
              });
            }

            currentEvent = ''; // reset after data consumed
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      this.ngZone.run(async () => {
        console.error('SSE error:', error);
        await this.addDefaultReply();
        this.recomputeState();
        this.scrollToBottom();
      });
    } finally {
      this.abortControllers.delete(controller);
    }
  }

  /** Recompute aggregate streaming flags from all messages (supports concurrent streams). */
  private recomputeState() {
    const active = this.messages.filter((m: any) => m.isStreaming);
    this.isLoading = active.length > 0;
    const thinkingMsgs = active.filter((m: any) => m.isThinkingMsg);
    this.isThinking = thinkingMsgs.length > 0;
    this.feedbackStatus = thinkingMsgs.length > 0
      ? thinkingMsgs[thinkingMsgs.length - 1].feedbackStatus
      : '';
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

  private async parseMarkdown(text: string, isStreaming = false): Promise<SafeHtml> {
    const input = typeof text === 'string' ? text : String(text ?? '');
    const processed = input.replace(/\[\[([^\]]+)\]\]/g, (_match, page: string) => {
      const trimmed = page.trim();
      const slug = trimmed.replace(/\s+/g, '-');
      return `<a href="http://192.168.1.19:3000/${slug}" target="_blank" rel="noopener" class="wikilink" style="color:#facc15;text-decoration:none;border-bottom:1px dashed #facc15;padding:0 2px;">${trimmed}</a>`;
    });
    let html = await marked.parse(processed);
    // Inject inline styles on all <a> tags to ensure visibility on dark backgrounds
    // (Angular Material's light theme overrides :ng-deep link colors)
    html = html.replace(/<a /g, '<a style="color:#7dd3fc;text-decoration:underline;text-underline-offset:2px;" ');
    const withCopyButtons = html.replace(
      /<pre><code/g,
      '<div class="code-block-wrapper"><button class="copy-btn">Copy</button><pre><code'
    ).replace(
      /<\/code><\/pre>/g,
      '</code></pre></div>'
    );
    html = withCopyButtons;
    if (isStreaming) {
      html = html.replace(/<\/p>\s*$/, '<span class="streaming-cursor"></span></p>');
      if (!html.includes('streaming-cursor')) {
        html += '<span class="streaming-cursor"></span>';
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  /** Lightweight markdown for feedback step content (no copy buttons needed) */
  private async parseInlineMarkdown(text: string): Promise<SafeHtml> {
    const input = typeof text === 'string' ? text : String(text ?? '');
    let html = await marked.parse(input);
    html = html.replace(/<a /g, '<a style="color:#7dd3fc;text-decoration:underline;text-underline-offset:2px;" ');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private getCurrentTime(): string {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
}
