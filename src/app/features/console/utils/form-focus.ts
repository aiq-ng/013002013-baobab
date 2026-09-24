/**
 * After a rejected submit, puts the editor straight on the first field that
 * needs fixing (GOV.UK / WCAG 3.3.1 pattern) instead of leaving them to hunt
 * down a long form for a red message. Fields inside a `hidden` panel (an
 * inactive tab) are skipped — the page switches panels first. Call once the
 * form has re-rendered (e.g. from `afterNextRender`) so `aria-invalid` is set.
 */
export function focusFirstInvalid(host: HTMLElement): boolean {
  const target = Array.from(host.querySelectorAll<HTMLElement>('[aria-invalid="true"]')).find(
    (el) => !el.closest('[hidden]'),
  );
  if (!target) return false;
  target.focus();
  target.scrollIntoView?.({ block: 'center' });
  return true;
}
