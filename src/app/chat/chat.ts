import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  status: 'available' | 'away' | 'inactive';
  lastMessage?: string;
  lastMessageTime?: string;
}

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements OnInit {

  users: User[] = [
    {
      id: 1,
      name: 'Bucky Barnes',
      email: 'wintersoldiergmail.com',
      avatar: 'assets/images/winter-soldier.jpg',
      status: 'available',
      lastMessage: 'Why are you protecting me?',
      lastMessageTime: '4 min'
    },
    {
      id: 2,
      name: 'Steve Rogers',
      email: 'captainamericagmail.com',
      avatar: 'assets/images/captain-america.jpg',
      status: 'away',
      lastMessage: 'Coz you\'re my best friend',
      lastMessageTime: '3 min'
    },
    {
      id: 3,
      name: 'Sam Wilson',
      email: 'flyingfalcongmail.com',
      avatar: 'assets/images/flying-falcon.jpg',
      status: 'inactive',
      lastMessage: 'I don\'t remember you',
      lastMessageTime: '2 Min'
    },
    {
      id: 4,
      name: 'Natasha Romanoff',
      email: 'blackwidowgmail.com',
      avatar: 'assets/images/black-widow.jpg',
      status: 'inactive',
      lastMessage: 'Well, okay!',
      lastMessageTime: 'Now'
    },
    {
      id: 5,
      name: 'Tony Stark',
      email: 'imironman4ugmail.com',
      avatar: 'assets/images/iron-man.jpg',
      status: 'inactive',
      lastMessage: 'But I remember you',
      lastMessageTime: '1 Min'
    }
  ];

  filteredUsers: User[] = [];
  searchTerm: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.filteredUsers = [...this.users];
  }

  openChatView(user: User) {
    // Navigate to chatview page with user data
    this.router.navigate(['/chatview'], { 
      queryParams: { 
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userAvatar: user.avatar
      }
    });
  }

  searchUsers(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchTerm = searchTerm;
    
    if (searchTerm.trim() === '') {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'available':
        return 'available';
      case 'away':
        return 'away';
      case 'inactive':
        return 'inactive';
      default:
        return 'inactive';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'available':
        return '在线';
      case 'away':
        return '离开';
      case 'inactive':
        return '离线';
      default:
        return '离线';
    }
  }
}
