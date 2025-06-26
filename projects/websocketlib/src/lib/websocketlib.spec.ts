import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Websocketlib } from './websocketlib';

describe('Websocketlib', () => {
  let component: Websocketlib;
  let fixture: ComponentFixture<Websocketlib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Websocketlib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Websocketlib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
