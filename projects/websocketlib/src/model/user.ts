import { Injectable } from '@angular/core';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class User {
  public userName: string;
	
	public userId: string;
	
	public password: string;
	
  public authToken: string;
}
