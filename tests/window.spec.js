import { test, expect } from '@playwright/test';
import { Window } from '../src/window.js';

test.describe('Window class', () => {
    test.describe('constructor', () => {
        test('should create a new Window instance', () => {
            const window = new Window();
            expect(window).toBeInstanceOf(Window);
        });
    });
}); 