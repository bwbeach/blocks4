/**
 * Window class to hold state for individual windows
 */
export class Window {
    constructor() {
        this.width = 6;
        this.height = 6;
    }

    getWidth() {
        return this.width;
    }

    setWidth(width) {
        if (!Number.isInteger(width)) {
            throw new Error('Width must be an integer');
        }
        if (width < 1 || width > 100) {
            throw new Error('Width must be between 1 and 100');
        }
        this.width = width;
    }

    getHeight() {
        return this.height;
    }

    setHeight(height) {
        if (!Number.isInteger(height)) {
            throw new Error('Height must be an integer');
        }
        if (height < 1 || height > 100) {
            throw new Error('Height must be between 1 and 100');
        }
        this.height = height;
    }

    toJson() {
        return {
            width: this.width,
            height: this.height
        };
    }

    static fromJson(jsonData) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        const window = new Window();

        if (jsonData.width !== undefined) {
            window.setWidth(jsonData.width);
        }

        if (jsonData.height !== undefined) {
            window.setHeight(jsonData.height);
        }

        return window;
    }
} 