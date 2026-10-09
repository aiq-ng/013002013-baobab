import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { ConsoleApi } from './console-api';

const API = 'http://localhost:8000/api/v1';

function setup() {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  return { api: TestBed.inject(ConsoleApi), http: TestBed.inject(HttpTestingController) };
}

describe('ConsoleApi CSRF', () => {
  // The console and API are on different sites, so the CSRF cookie is not
  // readable via document.cookie — the token must come from the session body.
  it('echoes the token from the sign-in response on mutating calls', async () => {
    const { api, http } = setup();
    const session = firstValueFrom(api.signIn('a@b.c', 'pw'));
    http
      .expectOne(`${API}/admin/session`)
      .flush({ email: 'a@b.c', role: 'admin', csrfToken: 'tok-1' });
    await session;

    void firstValueFrom(api.signPdfUpload());
    const sign = http.expectOne(`${API}/admin/media/pdf-uploads`);
    expect(sign.request.headers.get('X-CSRF-Token')).toBe('tok-1');
  });

  it('echoes the token from a restored session', async () => {
    const { api, http } = setup();
    const session = firstValueFrom(api.readSession());
    http
      .expectOne(`${API}/admin/session`)
      .flush({ email: 'a@b.c', role: 'admin', csrfToken: 'tok-2' });
    await session;

    void firstValueFrom(api.signImageUpload());
    const sign = http.expectOne(`${API}/admin/media/image-uploads`);
    expect(sign.request.headers.get('X-CSRF-Token')).toBe('tok-2');
  });
});
