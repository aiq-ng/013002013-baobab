import { FormControl } from '@angular/forms';
import { consoleValidators } from './console-validators';

describe('consoleValidators', () => {
  describe('notBlank', () => {
    it('rejects whitespace-only text as required', () => {
      expect(new FormControl('   ', consoleValidators.notBlank).errors).toEqual({ required: true });
      expect(new FormControl('', consoleValidators.notBlank).errors).toEqual({ required: true });
    });

    it('accepts real text', () => {
      expect(new FormControl(' ok ', consoleValidators.notBlank).errors).toBeNull();
    });
  });

  describe('safeLink', () => {
    it.each(['/images/a.jpg', '/documents/x.html', 'https://cdn.example/a.pdf'])(
      'accepts %s',
      (value) => {
        expect(new FormControl(value, consoleValidators.safeLink).errors).toBeNull();
      },
    );

    it.each([
      'javascript:alert(1)',
      'JavaScript:alert(1)',
      'data:text/html,<script>',
      'http://insecure.example/a.pdf',
      '//evil.example/a.pdf',
      '/\\evil.example',
      'relative/path',
      'https://',
    ])('rejects %s', (value) => {
      expect(new FormControl(value, consoleValidators.safeLink).errors).toEqual({ safeLink: true });
    });

    it('leaves emptiness to the required validator', () => {
      expect(new FormControl('', consoleValidators.safeLink).errors).toBeNull();
    });
  });

  describe('slug', () => {
    it('accepts lowercase hyphenated slugs only', () => {
      expect(new FormControl('sahel-water-2', consoleValidators.slug).errors).toBeNull();
      expect(new FormControl('Sahel Water', consoleValidators.slug).errors).not.toBeNull();
      expect(new FormControl('a--b', consoleValidators.slug).errors).not.toBeNull();
    });
  });
});
