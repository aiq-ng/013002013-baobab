import { TestBed } from '@angular/core/testing';
import { ConfirmService } from './confirm.service';

describe('ConfirmService', () => {
  let service: ConfirmService;

  beforeEach(() => {
    service = TestBed.inject(ConfirmService);
  });

  it('exposes the pending request and resolves true on confirm', async () => {
    const answer = service.ask({ title: 'Delete X?', message: 'Gone for good.' });
    expect(service.pending()?.title).toBe('Delete X?');

    service.resolve(true);

    expect(await answer).toBe(true);
    expect(service.pending()).toBeNull();
  });

  it('resolves false on cancel', async () => {
    const answer = service.ask({ title: 'Delete X?', message: '' });
    service.resolve(false);
    expect(await answer).toBe(false);
  });

  it('cancels an older question when a new one is asked, so no promise hangs', async () => {
    const first = service.ask({ title: 'First', message: '' });
    const second = service.ask({ title: 'Second', message: '' });

    expect(await first).toBe(false);
    expect(service.pending()?.title).toBe('Second');
    service.resolve(true);
    expect(await second).toBe(true);
  });

  it('defaults the labels and tone', () => {
    void service.ask({ title: 'T', message: 'M' });
    expect(service.pending()).toEqual(
      expect.objectContaining({ confirmLabel: 'Confirm', cancelLabel: 'Cancel', tone: 'default' }),
    );
  });
});
