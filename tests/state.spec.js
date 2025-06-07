import { test, expect } from '@playwright/test';
import { State } from '../state.js';

// TOOD: trim down to remove redundant and unnecessary tests

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

        test('should handle setting numWindows to 1', () => {
            const state = new State();
            state.setNumWindows(10);
            state.setNumWindows(1);
            expect(state.getNumWindows()).toBe(1);
        });

        test('should handle large numbers', () => {
            const state = new State();
            state.setNumWindows(1000);
            expect(state.getNumWindows()).toBe(1000);
        });

        test('should handle setting same value multiple times', () => {
            const state = new State();
            state.setNumWindows(7);
            state.setNumWindows(7);
            state.setNumWindows(7);
            expect(state.getNumWindows()).toBe(7);
        });

        test('should overwrite previous values', () => {
            const state = new State();
            state.setNumWindows(3);
            state.setNumWindows(8);
            state.setNumWindows(2);
            expect(state.getNumWindows()).toBe(2);
        });
    });

    test.describe('edge cases and boundaries', () => {
        test('should handle zero (even though it may not be valid business logic)', () => {
            const state = new State();
            state.setNumWindows(0);
            expect(state.getNumWindows()).toBe(0);
        });

        test('should handle negative numbers (even though it may not be valid business logic)', () => {
            const state = new State();
            state.setNumWindows(-5);
            expect(state.getNumWindows()).toBe(-5);
        });

        test('should handle floating point numbers', () => {
            const state = new State();
            state.setNumWindows(3.14);
            expect(state.getNumWindows()).toBe(3.14);
        });

        test('should handle very large numbers', () => {
            const state = new State();
            state.setNumWindows(Number.MAX_SAFE_INTEGER);
            expect(state.getNumWindows()).toBe(Number.MAX_SAFE_INTEGER);
        });
    });

    test.describe('multiple instances', () => {
        test('should maintain separate state for different instances', () => {
            const state1 = new State();
            const state2 = new State();

            state1.setNumWindows(3);
            state2.setNumWindows(7);

            expect(state1.getNumWindows()).toBe(3);
            expect(state2.getNumWindows()).toBe(7);
        });

        test('should not affect other instances when one is modified', () => {
            const state1 = new State();
            const state2 = new State();
            const state3 = new State();

            state1.setNumWindows(10);
            state2.setNumWindows(20);

            // Modify state1 again
            state1.setNumWindows(15);

            expect(state1.getNumWindows()).toBe(15);
            expect(state2.getNumWindows()).toBe(20);
            expect(state3.getNumWindows()).toBe(1); // Default value
        });
    });
}); 