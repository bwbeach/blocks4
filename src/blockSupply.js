/**
 * BlockSupply class to hold state for block supply configuration
 */
export class BlockSupply {
    constructor() {
        this.numColors = 3;
        this.colors = ['#ff0000', '#00ff00', '#0000ff']; // Default: red, green, blue
    }

    getNumColors() {
        return this.numColors;
    }

    setNumColors(count) {
        if (!Number.isInteger(count)) {
            throw new Error('Number of colors must be an integer');
        }
        if (count < 1 || count > 20) {
            throw new Error('Number of colors must be between 1 and 20');
        }
        this.numColors = count;

        // Adjust colors array to match numColors
        while (this.colors.length < count) {
            // Add new colors using a default color pattern
            const colorIndex = this.colors.length % 6;
            const defaultColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
            this.colors.push(defaultColors[colorIndex]);
        }
        while (this.colors.length > count) {
            this.colors.pop();
        }
    }

    getColors() {
        return this.colors;
    }

    getColor(index) {
        if (index < 0 || index >= this.colors.length) {
            throw new Error(`Color index ${index} is out of range`);
        }
        return this.colors[index];
    }

    setColor(index, hexColor) {
        if (index < 0 || index >= this.colors.length) {
            throw new Error(`Color index ${index} is out of range`);
        }
        if (!this.isValidHexColor(hexColor)) {
            throw new Error('Color must be a valid hex color (e.g., #ff0000)');
        }
        this.colors[index] = hexColor.toLowerCase();
    }

    isValidHexColor(color) {
        // Check if it's a valid hex color format (#rrggbb)
        return /^#[0-9a-fA-F]{6}$/.test(color);
    }

    toJson() {
        return {
            numColors: this.numColors,
            colors: this.colors
        };
    }

    static fromJson(jsonData) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        const blockSupply = new BlockSupply();

        if (jsonData.numColors !== undefined) {
            blockSupply.setNumColors(jsonData.numColors);
        }

        if (jsonData.colors && Array.isArray(jsonData.colors)) {
            for (let i = 0; i < jsonData.colors.length && i < blockSupply.colors.length; i++) {
                if (jsonData.colors[i] !== undefined) {
                    blockSupply.setColor(i, jsonData.colors[i]);
                }
            }
        }

        return blockSupply;
    }
} 