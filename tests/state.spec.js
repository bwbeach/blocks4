import { test, expect } from '@playwright/test';
import { State } from '../src/state.js';
import { Window } from '../src/window.js';
import { BlockSupply } from '../src/blockSupply.js';

test.describe('State class', () => {
    test.describe('constructor', () => {
        test('should initialize with default values', () => {
            const state = new State();
            expect(state.getNumWindows()).toBe(1);
            expect(state.getWindows()).toHaveLength(1);
            expect(state.getWindows()[0]).toBeInstanceOf(Window);
            expect(state.getBlockSupply()).toBeInstanceOf(BlockSupply);
        });
    });

    test.describe('setNumWindows and getNumWindows', () => {
        test('should set and get numWindows with positive integer', () => {
            const state = new State();
            state.setNumWindows(5);
            expect(state.getNumWindows()).toBe(5);
            expect(state.getWindows()).toHaveLength(5);
            state.getWindows().forEach(window => {
                expect(window).toBeInstanceOf(Window);
            });
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
        test('should return correct JSON representation', () => {
            const state = new State();
            state.setNumWindows(3);
            const json = state.toJson();

            expect(json).toEqual({
                numWindows: 3,
                windows: [
                    { width: 6, height: 6 },
                    { width: 6, height: 6 },
                    { width: 6, height: 6 }
                ],
                blockSupply: expect.objectContaining({
                    numColors: 3,
                    colors: expect.arrayContaining([
                        expect.stringMatching(/^#[0-9a-f]{6}$/),
                        expect.stringMatching(/^#[0-9a-f]{6}$/),
                        expect.stringMatching(/^#[0-9a-f]{6}$/)
                    ])
                })
            });
            expect(json.blockSupply.colors).toHaveLength(3);
        });
    });

    test.describe('fromJson', () => {
        test('should create new State instance from JSON object', () => {
            const jsonData = {
                numWindows: 2,
                blockSupply: { numColors: 2, colors: ['#123456', '#abcdef'] }
            };

            const state = State.fromJson(jsonData);
            expect(state).toBeInstanceOf(State);
            expect(state.getNumWindows()).toBe(2);
            expect(state.getWindows()).toHaveLength(2);
            state.getWindows().forEach(window => {
                expect(window).toBeInstanceOf(Window);
            });
            expect(state.getBlockSupply()).toBeInstanceOf(BlockSupply);
            expect(state.getBlockSupply().getNumColors()).toBe(2);
            expect(state.getBlockSupply().getColors()).toEqual(['#123456', '#abcdef']);
        });

        test('should preserve validation rules when loading from JSON', () => {
            expect(() => {
                State.fromJson({ numWindows: 0 });
            }).toThrow('Number of windows must be between 1 and 20');
        });

        test('should use default values for missing fields', () => {
            const state = State.fromJson({});
            expect(state.getNumWindows()).toBe(1); // Should use default value
        });

        test('should handle malformed JSON string', () => {
            expect(() => {
                State.fromJson('invalid json');
            }).toThrow();
        });
    });
}); 