import { simpleCalculator, Action } from './index';

const validTestCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 7, b: 2, action: Action.Subtract, expected: 5 },
  { a: 2, b: 3, action: Action.Multiply, expected: 6 },
  { a: 15, b: 3, action: Action.Divide, expected: 5 },
  { a: 2, b: 4, action: Action.Exponentiate, expected: 16 },
];

const invalidTestCases = [
  { a: 1, b: 2, action: 'invalid' },
  { a: '1', b: 2, action: Action.Add },
  { a: 1, b: null, action: Action.Subtract },
];

describe('simpleCalculator', () => {
  test.each(validTestCases)(
    'should return $expected for "$action" with a=$a and b=$b',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );

  test.each(invalidTestCases)(
    'should return null for invalid input a=$a b=$b action=$action',
    ({ a, b, action }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBeNull();
    },
  );
});
