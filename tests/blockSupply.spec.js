import { test, expect } from '@playwright/test';
import { BlockSupply } from '../src/blockSupply.js';

const MAX_COLORS = 20;

// Helper function to convert hex color to RGB values
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

// Helper function to calculate Euclidean distance between two colors in RGB space
function colorDistance(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    return Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
}

// Helper function to check if colors are well-distributed (no two colors too similar)
function areColorsWellDistributed(colors, minDistance = 80) {
    for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
            if (colorDistance(colors[i], colors[j]) < minDistance) {
                return false;
            }
        }
    }
    return true;
}

// Helper function to validate hex color format
function isValidHexColor(color) {
    return /^#[0-9a-f]{6}$/.test(color);
}

test.describe('BlockSupply class', () => {
    test.describe('constructor', () => {
        test('should initialize with default values', () => {
            const blockSupply = new BlockSupply();
            expect(blockSupply.getNumColors()).toBe(3);

            const colors = blockSupply.getColors();
            expect(colors).toHaveLength(3);
        });
    });

    test.describe('setNumColors and getNumColors', () => {
        test('should set and get numColors with positive integer', () => {
            const blockSupply = new BlockSupply();
            blockSupply.setNumColors(5);
            expect(blockSupply.getNumColors()).toBe(5);

            const colors = blockSupply.getColors();
            expect(colors).toHaveLength(5);
        });

        test('should accept boundary values 1 and MAX_COLORS', () => {
            const blockSupply = new BlockSupply();

            blockSupply.setNumColors(1);
            expect(blockSupply.getNumColors()).toBe(1);
            expect(blockSupply.getColors()).toHaveLength(1);
            expect(isValidHexColor(blockSupply.getColors()[0])).toBe(true);

            blockSupply.setNumColors(MAX_COLORS);
            expect(blockSupply.getNumColors()).toBe(MAX_COLORS);
            const colors = blockSupply.getColors();
            expect(colors).toHaveLength(MAX_COLORS);
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

            const originalColor = blockSupply.getColor(0);
            expect(isValidHexColor(originalColor)).toBe(true);

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

        test('test color distribution with defaults', () => {
            const blockSupply = new BlockSupply();

            // Test that colors are valid and reasonably well-distributed
            const colors = blockSupply.getColors();
            colors.forEach(color => {
                expect(isValidHexColor(color)).toBe(true);
            });
            expect(areColorsWellDistributed(colors)).toBe(true);
        });

        test('test color distribution with MAX_COLORS', () => {
            const blockSupply = new BlockSupply();

            blockSupply.setNumColors(MAX_COLORS);

            // Test that all MAX_COLORS are valid and reasonably well-distributed
            // Use a smaller minimum distance for MAX_COLORS since we have more colors to fit
            const colors = blockSupply.getColors();
            colors.forEach(color => {
                expect(isValidHexColor(color)).toBe(true);
            });
            expect(areColorsWellDistributed(colors, 40)).toBe(true);
        });
    });

    test.describe('toJson', () => {
        test('should return correct JSON representation', () => {
            const blockSupply = new BlockSupply();
            blockSupply.setNumColors(2);
            blockSupply.setColor(0, '#123456');
            const json = blockSupply.toJson();

            expect(json.numColors).toBe(2);
            expect(json.colors).toHaveLength(2);
            expect(json.colors[0]).toBe('#123456');
            expect(isValidHexColor(json.colors[1])).toBe(true);
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

            const colors = blockSupply.getColors();
            expect(colors).toHaveLength(3);
        });

        test('should handle malformed JSON string', () => {
            expect(() => {
                BlockSupply.fromJson('invalid json');
            }).toThrow();
        });
    });

    test.describe('block count management', () => {
        test('should initialize with zero blocks for each color', () => {
            const blockSupply = new BlockSupply();
            const counts = blockSupply.getBlockCounts();
            expect(counts).toHaveLength(3);
            counts.forEach(count => {
                expect(count).toBe(0);
            });
        });

        test('should get and set individual block counts', () => {
            const blockSupply = new BlockSupply();

            blockSupply.setBlockCount(0, 5);
            expect(blockSupply.getBlockCount(0)).toBe(5);

            blockSupply.setBlockCount(1, 10);
            expect(blockSupply.getBlockCount(1)).toBe(10);
        });

        test('should get all block counts', () => {
            const blockSupply = new BlockSupply();

            blockSupply.setBlockCount(0, 5);
            blockSupply.setBlockCount(1, 10);
            blockSupply.setBlockCount(2, 15);

            const counts = blockSupply.getBlockCounts();
            expect(counts).toEqual([5, 10, 15]);
            expect(counts).not.toBe(blockSupply.blockCounts); // Should return a copy
        });

        test('should throw error for invalid block count index', () => {
            const blockSupply = new BlockSupply();

            expect(() => {
                blockSupply.getBlockCount(-1);
            }).toThrow('Color index -1 is out of range');

            expect(() => {
                blockSupply.getBlockCount(3);
            }).toThrow('Color index 3 is out of range');

            expect(() => {
                blockSupply.setBlockCount(-1, 5);
            }).toThrow('Color index -1 is out of range');

            expect(() => {
                blockSupply.setBlockCount(3, 5);
            }).toThrow('Color index 3 is out of range');
        });

        test('should throw error for invalid block count values', () => {
            const blockSupply = new BlockSupply();

            expect(() => {
                blockSupply.setBlockCount(0, -1);
            }).toThrow('Block count cannot be negative');

            expect(() => {
                blockSupply.setBlockCount(0, 3.5);
            }).toThrow('Block count must be an integer');
        });

        test('should maintain block counts when changing number of colors', () => {
            const blockSupply = new BlockSupply();

            // Set some initial block counts
            blockSupply.setBlockCount(0, 5);
            blockSupply.setBlockCount(1, 10);
            blockSupply.setBlockCount(2, 15);

            // Increase number of colors
            blockSupply.setNumColors(4);
            expect(blockSupply.getBlockCounts()).toEqual([5, 10, 15, 0]);

            // Decrease number of colors
            blockSupply.setNumColors(2);
            expect(blockSupply.getBlockCounts()).toEqual([5, 10]);
        });
    });

    test.describe('toJson with block counts', () => {
        test('should include block counts in JSON representation', () => {
            const blockSupply = new BlockSupply();
            blockSupply.setBlockCount(0, 5);
            blockSupply.setBlockCount(1, 10);
            blockSupply.setBlockCount(2, 15);

            const json = blockSupply.toJson();
            expect(json.blockCounts).toEqual([5, 10, 15]);
        });
    });

    test.describe('fromJson with block counts', () => {
        test('should load block counts from JSON', () => {
            const jsonData = {
                numColors: 2,
                colors: ['#123456', '#abcdef'],
                blockCounts: [5, 10]
            };

            const blockSupply = BlockSupply.fromJson(jsonData);
            expect(blockSupply.getBlockCounts()).toEqual([5, 10]);
        });

        test('should handle missing block counts in JSON', () => {
            const jsonData = {
                numColors: 2,
                colors: ['#123456', '#abcdef']
            };

            const blockSupply = BlockSupply.fromJson(jsonData);
            expect(blockSupply.getBlockCounts()).toEqual([0, 0]);
        });

        test('should validate block counts when loading from JSON', () => {
            expect(() => {
                BlockSupply.fromJson({
                    numColors: 2,
                    colors: ['#123456', '#abcdef'],
                    blockCounts: [-1, 10]
                });
            }).toThrow('Block count cannot be negative');

            expect(() => {
                BlockSupply.fromJson({
                    numColors: 2,
                    colors: ['#123456', '#abcdef'],
                    blockCounts: [3.5, 10]
                });
            }).toThrow('Block count must be an integer');
        });
    });
}); 