import { Component, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { ConsoleLayout } from './console-layout';
import { ConsoleStore } from '../../features/console/services/console-store';
import { AdminSession } from '../../features/console/models/admin';

@Component({ selector: 'app-stub', standalone: true, template: 'stub content' })
class StubComponent {}

describe('ConsoleLayout', () => {
  async function setup(session: AdminSession | null) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'console',
            component: ConsoleLayout,
            children: [{ path: '', component: StubComponent }],
          },
        ]),
        {
          provide: ConsoleStore,
          useValue: {
            session: signal(session).asReadonly(),
            signOut: () => Promise.resolve(),
          },
        },
      ],
    });

    const harness = await RouterTestingHarness.create('/console');
    return harness;
  }

  it('renders the router outlet (and its routed content) when there is no session', async () => {
    const harness = await setup(null);

    expect(harness.routeNativeElement?.textContent).toContain('stub content');
  });

  it('renders the admin chrome and the router outlet when there is a session', async () => {
    const harness = await setup({ email: 'admin@baobab.org', role: 'admin' });

    expect(harness.routeNativeElement?.textContent).toContain('admin@baobab.org');
    expect(harness.routeNativeElement?.textContent).toContain('stub content');
  });
});
