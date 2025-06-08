/**
 * State class to hold the entire application state
 */
import { Window } from './window.js';

export class State {
    constructor() {
        this.numWindows = 1;
        this.windows = [new Window()];
    }

    setNumWindows(count) {
        if (!Number.isInteger(count)) {
            throw new Error('Number of windows must be an integer');
        }
        if (count < 1 || count > 20) {
            throw new Error('Number of windows must be between 1 and 20');
        }
        this.numWindows = count;

        // Adjust windows array to match numWindows
        while (this.windows.length < count) {
            this.windows.push(new Window());
        }
        while (this.windows.length > count) {
            this.windows.pop();
        }
    }

    getNumWindows() {
        return this.numWindows;
    }

    getWindows() {
        return this.windows;
    }

    toJson() {
        return {
            numWindows: this.numWindows,
            windows: this.windows.map(() => ({})) // Empty objects for now since Window has no state
        };
    }

    static fromJson(jsonData) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        const state = new State();

        if (jsonData.numWindows !== undefined) {
            state.setNumWindows(jsonData.numWindows);
        }

        // Windows array is automatically created by setNumWindows
        // When Window class gets state, we'll deserialize windows here

        return state;
    }
} 