import { test, expect } from '@playwright/test';
import { State } from '../state.js';

test.describe('State class', () => {
    test.describe('constructor', () => {
        test('should initialize with default values', () => {
            const state = new State();
            expect(state.getNumWindows()).toBe(1);
        });
    });

    test.describe('setNumWindows and getNumWindows', () => {
        test('should set and get numWindows with positive integer', () => {
            const state = new State();
            state.setNumWindows(5);
            expect(state.getNumWindows()).toBe(5);
        });

        test('should accept boundary values 1 and 20', () => {
            const state = new State();

            state.setNumWindows(1);
            expect(state.getNumWindows()).toBe(1);

            state.setNumWindows(20);
            expect(state.getNumWindows()).toBe(20);
        });
    });

    test.describe('validation constraints', () => {
        test('should throw error for non-integer values', () => {
            const state = new State();

            expect(() => {
                state.setNumWindows(3.5);
            }).toThrow('Number of windows must be an integer');

            expect(() => {
                state.setNumWindows('5');
            }).toThrow('Number of windows must be an integer');
        });

        test('should throw error for value below 1', () => {
            const state = new State();

            expect(() => {
                state.setNumWindows(0);
            }).toThrow('Number of windows must be between 1 and 20');
        });

        test('should throw error for value above 20', () => {
            const state = new State();

            expect(() => {
                state.setNumWindows(21);
            }).toThrow('Number of windows must be between 1 and 20');
        });

        test('should not modify state when validation fails', () => {
            const state = new State();
            state.setNumWindows(5);

            try {
                state.setNumWindows(0);
            } catch (error) {
                // Expected to throw
            }

            // State should remain unchanged
            expect(state.getNumWindows()).toBe(5);
        });
    });

    test.describe('toJson', () => {
        test('should return correct JSON representation with default values', () => {
            const state = new State();
            const json = state.toJson();

            expect(json).toEqual({
                numWindows: 1
            });
        });

        test('should return correct JSON representation with modified values', () => {
            const state = new State();
            state.setNumWindows(10);
            const json = state.toJson();

            expect(json).toEqual({
                numWindows: 10
            });
        });
    });

    test.describe('fromJson', () => {
        test('should restore state from JSON object', () => {
            const state = new State();
            const jsonData = { numWindows: 15 };

            state.fromJson(jsonData);
            expect(state.getNumWindows()).toBe(15);
        });

        test('should restore state from JSON string', () => {
            const state = new State();
            const jsonString = '{"numWindows": 8}';

            state.fromJson(jsonString);
            expect(state.getNumWindows()).toBe(8);
        });

        test('should return this for method chaining', () => {
            const state = new State();
            const result = state.fromJson({ numWindows: 3 });

            expect(result).toBe(state);
        });

        test('should preserve validation rules when loading from JSON', () => {
            const state = new State();

            expect(() => {
                state.fromJson({ numWindows: 0 });
            }).toThrow('Number of windows must be between 1 and 20');

            expect(() => {
                state.fromJson({ numWindows: 25 });
            }).toThrow('Number of windows must be between 1 and 20');
        });

        test('should handle missing properties gracefully', () => {
            const state = new State();
            state.setNumWindows(5);

            state.fromJson({});
            expect(state.getNumWindows()).toBe(5); // Should remain unchanged
        });

        test('should handle malformed JSON string', () => {
            const state = new State();

            expect(() => {
                state.fromJson('invalid json');
            }).toThrow();
        });
    });
}); 