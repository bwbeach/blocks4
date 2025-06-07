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
    });

    test.describe('edge cases and boundaries', () => {
        test('should handle zero (even though it may not be valid business logic)', () => {
            const state = new State();
            state.setNumWindows(0);
            expect(state.getNumWindows()).toBe(0);
        });
    });
}); 