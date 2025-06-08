import { test, expect } from '@playwright/test';
import { Window } from '../src/window.js';

test.describe('Window class', () => {
    test.describe('constructor', () => {
        test('should create a new Window instance', () => {
            const window = new Window();
            expect(window).toBeInstanceOf(Window);
        });
    });

    test.describe('toJson', () => {
        test('should return empty object', () => {
            const window = new Window();
            const json = window.toJson();

            expect(json).toEqual({});
        });
    });

    test.describe('fromJson', () => {
        test('should create new Window instance from JSON object', () => {
            const jsonData = {};

            const window = Window.fromJson(jsonData);
            expect(window).toBeInstanceOf(Window);
        });

        test('should create new Window instance from JSON string', () => {
            const jsonString = '{}';

            const window = Window.fromJson(jsonString);
            expect(window).toBeInstanceOf(Window);
        });

        test('should handle malformed JSON string', () => {
            expect(() => {
                Window.fromJson('invalid json');
            }).toThrow();
        });
    });
}); 