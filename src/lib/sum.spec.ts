// sum.test.ts
import sum from './sum';

describe('sum function', () => {
  test('should add two positive numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('should add two negative numbers correctly', () => {
    expect(sum(-1, -2)).toBe(-3);
  });

  test('should add a positive and a negative number correctly', () => {
    expect(sum(1, -2)).toBe(-1);
  });

  test('should add zero correctly', () => {
    expect(sum(0, 5)).toBe(5);
    expect(sum(5, 0)).toBe(5);
  });
});
