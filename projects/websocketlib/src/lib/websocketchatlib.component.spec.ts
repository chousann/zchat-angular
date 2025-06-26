import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsocketchatlibComponent } from './websocketchatlib.component';

describe('WebsocketchatlibComponent', () => {
  let component: WebsocketchatlibComponent;
  let fixture: ComponentFixture<WebsocketchatlibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsocketchatlibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsocketchatlibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
