import { focusFirstInvalid } from './form-focus';

describe('focusFirstInvalid', () => {
  it('focuses the first invalid field in document order and reports it', () => {
    const host = document.createElement('form');
    host.innerHTML = `
      <input id="a" />
      <textarea id="b" aria-invalid="true"></textarea>
      <input id="c" aria-invalid="true" />`;
    document.body.appendChild(host);

    expect(focusFirstInvalid(host)).toBe(true);
    expect(document.activeElement?.id).toBe('b');
    host.remove();
  });

  it('returns false when nothing is invalid', () => {
    const host = document.createElement('form');
    host.innerHTML = '<input id="a" />';
    expect(focusFirstInvalid(host)).toBe(false);
  });

  it('skips invalid fields inside hidden panels', () => {
    const host = document.createElement('form');
    host.innerHTML = `
      <div hidden><input id="hidden" aria-invalid="true" /></div>
      <input id="shown" aria-invalid="true" />`;
    document.body.appendChild(host);

    expect(focusFirstInvalid(host)).toBe(true);
    expect(document.activeElement?.id).toBe('shown');
    host.remove();
  });
});
