/**
 * Maximum number of different colors of blocks in the supply.
 */
const MAX_COLORS = 20;

/**
 * BlockSupply class to hold state for block supply configuration
 */
export class BlockSupply {
    constructor() {
        this.numColors = 3;
        this.colors = [0, 1, 2].map(i => this.makeDefaultColor(i));
    }

    getNumColors() {
        return this.numColors;
    }

    setNumColors(count) {
        if (!Number.isInteger(count)) {
            throw new Error('Number of colors must be an integer');
        }
        if (count < 1 || count > MAX_COLORS) {
            throw new Error(`Number of colors must be between 1 and ${MAX_COLORS}`);
        }
        this.numColors = count;

        // Adjust colors array to match numColors
        while (this.colors.length < count) {
            const colorIndex = this.colors.length;
            this.colors.push(this.makeDefaultColor(colorIndex));
        }
        while (this.colors.length > count) {
            this.colors.pop();
        }
    }

    /**
     * Generates a default color for the given index by mapping indices to points around
     * a color wheel. 
     * 
     * Using MAX_COLOR points around the circle in order would make the initial three default
     * colors close together.  Instead we pick an increment that lands back at a multiple of
     * PI/2 after MAX_COLORS but has a slightly longer stride by going around the circle one
     * more time that needed.
     * 
     * @param {number} index - The index of the color to generate (0 to MAX_COLORS-1)
     * @returns {string} A hex color string like "#ff0000"
     */
    makeDefaultColor(index) {
        const fullRevolutions = (MAX_COLORS + 1) / 3;
        const fullSpanRadians = fullRevolutions * 2 * Math.PI;
        const incrementRadians = fullSpanRadians / MAX_COLORS;
        const angle = index * incrementRadians;
        const thirdOfCircle = Math.PI * 2 / 3;

        // Calculate RGB values, ensuring they're in the 0-255 range
        const red = Math.round((Math.cos(angle) + 1) * 127.5);
        const green = Math.round((Math.cos(angle + thirdOfCircle) + 1) * 127.5);
        const blue = Math.round((Math.cos(angle + 2 * thirdOfCircle) + 1) * 127.5);

        // Convert to hex, ensuring proper formatting
        const redHex = Math.max(0, Math.min(255, red)).toString(16).padStart(2, '0');
        const greenHex = Math.max(0, Math.min(255, green)).toString(16).padStart(2, '0');
        const blueHex = Math.max(0, Math.min(255, blue)).toString(16).padStart(2, '0');

        return `#${redHex}${greenHex}${blueHex}`;
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