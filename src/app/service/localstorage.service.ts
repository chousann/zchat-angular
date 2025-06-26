import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  private localStorage: any;

  public msgEvent: EventEmitter<any> = new EventEmitter<any>();
  constructor() { 
    if (!localStorage) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.localStorage = localStorage;
  }

  public set(key:string, value:string):void {
    this.localStorage[key] = value;
  }
 
  public get(key:string):string {
    return this.localStorage[key] || false;
  }
 
  public setArr(key:string, value:Array<any>):void {
    this.localStorage.setItem(key, JSON.stringify(value));
  }
  //JSON.stringify(value)
  //JSON.parse
  public getArr(key:string):Array<any> {
    return JSON.parse(this.localStorage.getItem(key)) || new Array<any>();
  }
 
  public remove(key:string):any {
    this.localStorage.removeItem(key);
  }
  public removeAll():any{
 
    this.localStorage.clear();
  }
}
