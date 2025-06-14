/**
 * Maximum number of different colors of blocks in the supply.
 */
const MAX_COLORS = 20;

/**
 * Adjusts an array to a desired size by either adding elements using a default value generator
 * or removing elements from the end.
 * @param {Array} array - The array to adjust
 * @param {number} desiredSize - The target size for the array
 * @param {function(number): any} defaultValueFn - Function that generates default values for new elements
 * @returns {Array} The adjusted array
 */
function adjustArraySize(array, desiredSize, defaultValueFn) {
    while (array.length < desiredSize) {
        const index = array.length;
        array.push(defaultValueFn(index));
    }
    while (array.length > desiredSize) {
        array.pop();
    }
    return array;
}

/**
 * BlockSupply class to hold state for block supply configuration
 */
export class BlockSupply {
    constructor() {
        this.numColors = 3;
        this.colors = [];
        this.blockCounts = [];
        this._adjustArraysToSize(this.numColors);
    }

    /**
     * Private method to adjust both colors and blockCounts arrays to a given size
     * @private
     * @param {number} size - The target size for both arrays
     */
    _adjustArraysToSize(size) {
        adjustArraySize(this.colors, size, i => this.makeDefaultColor(i));
        adjustArraySize(this.blockCounts, size, () => 0);
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
        this._adjustArraysToSize(count);
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

    /**
     * Get the number of blocks available for a specific color
     * @param {number} index - The index of the color
     * @returns {number} The number of blocks available for this color
     */
    getBlockCount(index) {
        if (index < 0 || index >= this.colors.length) {
            throw new Error(`Color index ${index} is out of range`);
        }
        return this.blockCounts[index];
    }

    /**
     * Set the number of blocks available for a specific color
     * @param {number} index - The index of the color
     * @param {number} count - The number of blocks to set
     */
    setBlockCount(index, count) {
        if (index < 0 || index >= this.colors.length) {
            throw new Error(`Color index ${index} is out of range`);
        }
        if (!Number.isInteger(count)) {
            throw new Error('Block count must be an integer');
        }
        if (count < 0) {
            throw new Error('Block count cannot be negative');
        }
        this.blockCounts[index] = count;
    }

    /**
     * Get all block counts
     * @returns {number[]} Array of block counts for each color
     */
    getBlockCounts() {
        return [...this.blockCounts];
    }

    toJson() {
        return {
            numColors: this.numColors,
            colors: this.colors,
            blockCounts: this.blockCounts
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

        if (jsonData.blockCounts && Array.isArray(jsonData.blockCounts)) {
            for (let i = 0; i < jsonData.blockCounts.length && i < blockSupply.blockCounts.length; i++) {
                if (jsonData.blockCounts[i] !== undefined) {
                    blockSupply.setBlockCount(i, jsonData.blockCounts[i]);
                }
            }
        }

        return blockSupply;
    }
} 