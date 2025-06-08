/**
 * Window class to hold state for individual windows
 */
export class Window {
    constructor() {
        // Empty constructor - state will be added later
    }

    toJson() {
        return {};
    }

    static fromJson(jsonData) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        const window = new Window();

        // When Window gets state properties, deserialize them here

        return window;
    }
} 