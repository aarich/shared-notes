import { getLocationOfNewNewLine, getNextLineCharacter } from '../editor';

import each from 'jest-each';

describe('getLocationOfNewNewLine', () => {
  each([
    ['abc', 'abc\n', 3],
    ['abc\n', 'abc\n\n', 3],
    ['abc', 'ab\nc', 2],
    ['abc', '\nabc', 0],
    ['\nabc\nabc\n', '\nabc\n\nabc\n', 4],
    ['abc', 'abc\ntest', undefined],
  ]).test('old: %s new: %s expected: %s', (oldStr, newStr, expected) => {
    const actual = getLocationOfNewNewLine(oldStr, newStr);
    expected ? expect(actual).toBe(expected) : expect(actual).toBeUndefined();
  });
});

describe('getNextLineCharacter', () => {
  each([
    ['abc2', undefined],
    ['2 3', '3 '],
    ['- test', '- '],
    ['5. test', '6. '],
    ['78 79', '79 '],
    ['22', '23'],
    ['22.', '23.'],
    ['223dfdfdf', undefined],
  ]).test('input: %s output: %s', (input, expected) => {
    const actual = getNextLineCharacter(input);
    expected ? expect(actual).toBe(expected) : expect(actual).toBeUndefined();
  });
});
