import { TestBed } from '@angular/core/testing';

import { WebsocketchatService } from './websocketchat.service';

describe('WebsocketchatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebsocketchatService = TestBed.get(WebsocketchatService);
    expect(service).toBeTruthy();
  });
});
