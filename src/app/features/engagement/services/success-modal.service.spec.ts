import { TestBed } from '@angular/core/testing';
import { SuccessModalService } from './success-modal.service';

describe('SuccessModalService', () => {
  let service: SuccessModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuccessModalService);
  });

  it('starts with no active submission', () => {
    expect(service.current()).toBeNull();
  });

  it('shows a submission with its source and reference id', () => {
    service.show('contact-form', 'BB-1');
    expect(service.current()).toEqual({ source: 'contact-form', referenceId: 'BB-1' });
  });

  it('clears the active submission on close', () => {
    service.show('contact-form', 'BB-1');
    service.close();
    expect(service.current()).toBeNull();
  });
});
