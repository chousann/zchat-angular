import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnttabsComponent } from './anttabs.component';

describe('AnttabsComponent', () => {
  let component: AnttabsComponent;
  let fixture: ComponentFixture<AnttabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnttabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnttabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
