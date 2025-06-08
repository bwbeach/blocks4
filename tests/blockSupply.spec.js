import { test, expect } from '@playwright/test';
import { BlockSupply } from '../src/blockSupply.js';

const MAX_COLORS = 20;

test.describe('BlockSupply class', () => {
    test.describe('constructor', () => {
        test('should initialize with default values', () => {
            const blockSupply = new BlockSupply();
            expect(blockSupply.getNumColors()).toBe(3);
            expect(blockSupply.getColors()).toEqual(['#ff4040', '#354cfe', '#58fc2a']);
        });
    });

    test.describe('setNumColors and getNumColors', () => {
        test('should set and get numColors with positive integer', () => {
            const blockSupply = new BlockSupply();
            blockSupply.setNumColors(5);
            expect(blockSupply.getNumColors()).toBe(5);
            expect(blockSupply.getColors()).toHaveLength(5);
        });

        test('should accept boundary values 1 and MAX_COLORS', () => {
            const blockSupply = new BlockSupply();

            blockSupply.setNumColors(1);
            expect(blockSupply.getNumColors()).toBe(1);
            expect(blockSupply.getColors()).toHaveLength(1);

            blockSupply.setNumColors(MAX_COLORS);
            expect(blockSupply.getNumColors()).toBe(MAX_COLORS);
            expect(blockSupply.getColors()).toHaveLength(MAX_COLORS);
        });
    });

    test.describe('validation constraints', () => {
        test('should throw error for non-integer values', () => {
            const blockSupply = new BlockSupply();

            expect(() => {
                blockSupply.setNumColors(3.5);
            }).toThrow('Number of colors must be an integer');
        });

        test('should throw error for value below 1', () => {
            const blockSupply = new BlockSupply();

            expect(() => {
                blockSupply.setNumColors(0);
            }).toThrow(`Number of colors must be between 1 and ${MAX_COLORS}`);
        });

        test('should throw error for value above MAX_COLORS', () => {
            const blockSupply = new BlockSupply();

            expect(() => {
                blockSupply.setNumColors(MAX_COLORS + 1);
            }).toThrow(`Number of colors must be between 1 and ${MAX_COLORS}`);
        });

        test('should not modify state when validation fails', () => {
            const blockSupply = new BlockSupply();
            blockSupply.setNumColors(5);

            try {
                blockSupply.setNumColors(0);
            } catch (error) {
                // Expected to throw
            }

            // State should remain unchanged
            expect(blockSupply.getNumColors()).toBe(5);
        });
    });

    test.describe('color management', () => {
        test('should get and set individual colors', () => {
            const blockSupply = new BlockSupply();

            expect(blockSupply.getColor(0)).toBe('#ff4040');

            blockSupply.setColor(0, '#123456');
            expect(blockSupply.getColor(0)).toBe('#123456');
        });

        test('should normalize hex colors to lowercase', () => {
            const blockSupply = new BlockSupply();

            blockSupply.setColor(0, '#ABCDEF');
            expect(blockSupply.getColor(0)).toBe('#abcdef');
        });

        test('should throw error for invalid color index', () => {
            const blockSupply = new BlockSupply();

            expect(() => {
                blockSupply.getColor(-1);
            }).toThrow('Color index -1 is out of range');

            expect(() => {
                blockSupply.getColor(3);
            }).toThrow('Color index 3 is out of range');

            expect(() => {
                blockSupply.setColor(-1, '#ff0000');
            }).toThrow('Color index -1 is out of range');

            expect(() => {
                blockSupply.setColor(3, '#ff0000');
            }).toThrow('Color index 3 is out of range');
        });

        test('should throw error for invalid hex color format', () => {
            const blockSupply = new BlockSupply();

            expect(() => {
                blockSupply.setColor(0, 'invalid');
            }).toThrow('Color must be a valid hex color (e.g., #ff0000)');

            expect(() => {
                blockSupply.setColor(0, '#ff00');
            }).toThrow('Color must be a valid hex color (e.g., #ff0000)');

            expect(() => {
                blockSupply.setColor(0, 'ff0000');
            }).toThrow('Color must be a valid hex color (e.g., #ff0000)');
        });
    });

    test.describe('toJson', () => {
        test('should return correct JSON representation', () => {
            const blockSupply = new BlockSupply();
            blockSupply.setNumColors(2);
            blockSupply.setColor(0, '#123456');
            const json = blockSupply.toJson();

            expect(json).toEqual({
                numColors: 2,
                colors: ['#123456', '#354cfe']
            });
        });
    });

    test.describe('fromJson', () => {
        test('should create new BlockSupply instance from JSON object', () => {
            const jsonData = { numColors: 2, colors: ['#123456', '#abcdef'] };

            const blockSupply = BlockSupply.fromJson(jsonData);
            expect(blockSupply).toBeInstanceOf(BlockSupply);
            expect(blockSupply.getNumColors()).toBe(2);
            expect(blockSupply.getColors()).toEqual(['#123456', '#abcdef']);
        });

        test('should create new BlockSupply instance from JSON string', () => {
            const jsonString = '{"numColors": 2, "colors": ["#123456", "#abcdef"]}';

            const blockSupply = BlockSupply.fromJson(jsonString);
            expect(blockSupply).toBeInstanceOf(BlockSupply);
            expect(blockSupply.getNumColors()).toBe(2);
            expect(blockSupply.getColors()).toEqual(['#123456', '#abcdef']);
        });

        test('should preserve validation rules when loading from JSON', () => {
            expect(() => {
                BlockSupply.fromJson({ numColors: 0 });
            }).toThrow(`Number of colors must be between 1 and ${MAX_COLORS}`);

            expect(() => {
                BlockSupply.fromJson({ numColors: 2, colors: ['invalid', '#ff0000'] });
            }).toThrow('Color must be a valid hex color (e.g., #ff0000)');
        });

        test('should use default values for missing fields', () => {
            const blockSupply = BlockSupply.fromJson({});
            expect(blockSupply.getNumColors()).toBe(3);
            expect(blockSupply.getColors()).toEqual(['#ff4040', '#354cfe', '#58fc2a']);
        });

        test('should handle malformed JSON string', () => {
            expect(() => {
                BlockSupply.fromJson('invalid json');
            }).toThrow();
        });
    });
}); 