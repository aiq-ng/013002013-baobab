import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HasUnsavedChanges, unsavedChangesGuard } from './unsaved-changes.guard';
import { ConfirmService } from '../../../shared/ui/confirm-dialog/confirm.service';

describe('unsavedChangesGuard', () => {
  let ask: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    ask = vi.fn();
    TestBed.configureTestingModule({
      providers: [{ provide: ConfirmService, useValue: { ask } }],
    });
  });

  const run = (component: HasUnsavedChanges) =>
    TestBed.runInInjectionContext(() =>
      unsavedChangesGuard(
        component,
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
        {} as RouterStateSnapshot,
      ),
    );

  it('lets a clean form leave without asking', async () => {
    expect(await run({ hasUnsavedChanges: () => false })).toBe(true);
    expect(ask).not.toHaveBeenCalled();
  });

  it('asks before discarding edits, and stays when the editor cancels', async () => {
    ask.mockResolvedValue(false);
    expect(await run({ hasUnsavedChanges: () => true })).toBe(false);
    expect(ask).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Discard unsaved changes?', tone: 'danger' }),
    );
  });

  it('leaves when the editor confirms the discard', async () => {
    ask.mockResolvedValue(true);
    expect(await run({ hasUnsavedChanges: () => true })).toBe(true);
  });
});
