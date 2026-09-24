import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  RouterStateSnapshot,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { programResolver } from './program.resolver';
import { ProgramsApi } from '../services/programs.api';
import { ProgramsService } from '../services/programs.service';
import { makeProgram } from '../testing/program-fixture';

describe('programResolver', () => {
  function run(
    slug: string,
    api: Partial<ProgramsApi>,
    cached: ReturnType<typeof makeProgram>[] = [],
  ) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ProgramsApi, useValue: { list: () => of(cached), ...api } },
      ],
    });
    const route = { paramMap: convertToParamMap({ slug }) } as ActivatedRouteSnapshot;
    return async () => {
      if (cached.length) {
        await TestBed.inject(ProgramsService).load();
      }
      const result = TestBed.runInInjectionContext(() =>
        programResolver(route, {} as RouterStateSnapshot),
      );
      return isObservable(result) ? firstValueFrom(result) : result;
    };
  }

  it('fetches the program by slug', async () => {
    const program = makeProgram({ slug: 'a' });
    const get = vi.fn().mockReturnValue(of(program));

    expect(await run('a', { get })()).toEqual(program);
    expect(get).toHaveBeenCalledWith('a');
  });

  it('uses the already-loaded list without refetching', async () => {
    const program = makeProgram({ slug: 'a' });
    const get = vi.fn();

    expect(await run('a', { get }, [program])()).toEqual(program);
    expect(get).not.toHaveBeenCalled();
  });

  it('redirects to /not-found when the registry has no such program', async () => {
    const get = () => throwError(() => new HttpErrorResponse({ status: 404 }));

    const result = await run('gone', { get })();

    expect(result).toBeInstanceOf(RedirectCommand);
    expect((result as RedirectCommand).redirectTo.toString()).toBe('/not-found');
  });

  it('resolves null (an unavailable state, not a 404) on any other failure', async () => {
    const get = () => throwError(() => new HttpErrorResponse({ status: 0 }));

    expect(await run('a', { get })()).toBeNull();
  });
});
