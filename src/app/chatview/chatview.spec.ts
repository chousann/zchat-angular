import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chatview } from './chatview';

describe('Chatview', () => {
  let component: Chatview;
  let fixture: ComponentFixture<Chatview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Chatview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chatview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
