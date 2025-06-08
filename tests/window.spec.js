import { test, expect } from '@playwright/test';
import { Window } from '../src/window.js';

test.describe('Window class', () => {
    test.describe('constructor', () => {
        test('should create a new Window instance with default values', () => {
            const window = new Window();
            expect(window).toBeInstanceOf(Window);
            expect(window.getWidth()).toBe(6);
            expect(window.getHeight()).toBe(6);
        });
    });

    test.describe('width and height methods', () => {
        test('should set and get width', () => {
            const window = new Window();
            window.setWidth(10);
            expect(window.getWidth()).toBe(10);
        });

        test('should set and get height', () => {
            const window = new Window();
            window.setHeight(8);
            expect(window.getHeight()).toBe(8);
        });

        test('should accept boundary values for width', () => {
            const window = new Window();

            window.setWidth(1);
            expect(window.getWidth()).toBe(1);

            window.setWidth(100);
            expect(window.getWidth()).toBe(100);
        });

        test('should accept boundary values for height', () => {
            const window = new Window();

            window.setHeight(1);
            expect(window.getHeight()).toBe(1);

            window.setHeight(100);
            expect(window.getHeight()).toBe(100);
        });
    });

    test.describe('validation constraints', () => {
        test('should throw error for non-integer width values', () => {
            const window = new Window();

            expect(() => {
                window.setWidth(3.5);
            }).toThrow('Width must be an integer');
        });

        test('should throw error for non-integer height values', () => {
            const window = new Window();

            expect(() => {
                window.setHeight(3.5);
            }).toThrow('Height must be an integer');
        });

        test('should throw error for width below 1', () => {
            const window = new Window();

            expect(() => {
                window.setWidth(0);
            }).toThrow('Width must be between 1 and 100');
        });

        test('should throw error for width above 100', () => {
            const window = new Window();

            expect(() => {
                window.setWidth(101);
            }).toThrow('Width must be between 1 and 100');
        });

        test('should throw error for height below 1', () => {
            const window = new Window();

            expect(() => {
                window.setHeight(0);
            }).toThrow('Height must be between 1 and 100');
        });

        test('should throw error for height above 100', () => {
            const window = new Window();

            expect(() => {
                window.setHeight(101);
            }).toThrow('Height must be between 1 and 100');
        });

        test('should not modify state when width validation fails', () => {
            const window = new Window();
            window.setWidth(50);

            try {
                window.setWidth(0);
            } catch (error) {
                // Expected to throw
            }

            // Width should remain unchanged
            expect(window.getWidth()).toBe(50);
        });

        test('should not modify state when height validation fails', () => {
            const window = new Window();
            window.setHeight(25);

            try {
                window.setHeight(101);
            } catch (error) {
                // Expected to throw
            }

            // Height should remain unchanged
            expect(window.getHeight()).toBe(25);
        });
    });

    test.describe('toJson', () => {
        test('should return correct JSON representation with default values', () => {
            const window = new Window();
            const json = window.toJson();

            expect(json).toEqual({
                width: 6,
                height: 6
            });
        });

        test('should return correct JSON representation with modified values', () => {
            const window = new Window();
            window.setWidth(12);
            window.setHeight(8);
            const json = window.toJson();

            expect(json).toEqual({
                width: 12,
                height: 8
            });
        });
    });

    test.describe('fromJson', () => {
        test('should create new Window instance from JSON object with defaults', () => {
            const jsonData = {};

            const window = Window.fromJson(jsonData);
            expect(window).toBeInstanceOf(Window);
            expect(window.getWidth()).toBe(6);
            expect(window.getHeight()).toBe(6);
        });

        test('should create new Window instance from JSON object with custom values', () => {
            const jsonData = { width: 10, height: 15 };

            const window = Window.fromJson(jsonData);
            expect(window).toBeInstanceOf(Window);
            expect(window.getWidth()).toBe(10);
            expect(window.getHeight()).toBe(15);
        });

        test('should create new Window instance from JSON string', () => {
            const jsonString = '{"width": 8, "height": 12}';

            const window = Window.fromJson(jsonString);
            expect(window).toBeInstanceOf(Window);
            expect(window.getWidth()).toBe(8);
            expect(window.getHeight()).toBe(12);
        });

        test('should preserve validation rules when loading from JSON', () => {
            expect(() => {
                Window.fromJson({ width: 0, height: 6 });
            }).toThrow('Width must be between 1 and 100');

            expect(() => {
                Window.fromJson({ width: 6, height: 101 });
            }).toThrow('Height must be between 1 and 100');
        });

        test('should handle malformed JSON string', () => {
            expect(() => {
                Window.fromJson('invalid json');
            }).toThrow();
        });
    });
}); 