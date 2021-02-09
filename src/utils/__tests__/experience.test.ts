import each from 'jest-each';
import { validateSlug } from '../experience';

describe('validateSlug', () => {
  each([
    [true, 'test-slug'],
    [true, '---slug-test'],
    [true, 'a'],
    [true, '444'],
    [true, '---'],
    [false, 'invalid space'],
    [false, '😃'],
    [false, ' '],
    [false, ' asdf'],
  ]).test('valid: %s test: %s', (isValid, testSlug) => {
    const fn = () => validateSlug(testSlug);

    isValid
      ? expect(fn).not.toThrow()
      : expect(fn).toThrowError(
          'Invalid slug! Must be alphanumeric with hyphens anywhere.'
        );
  });
});
