/**
 * State class to hold the entire application state
 */
import { Window } from './window.js';
import { BlockSupply } from './blockSupply.js';

export class State {
    constructor() {
        this.numWindows = 1;
        this.windows = [new Window()];
        this.blockSupply = new BlockSupply();
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

    getBlockSupply() {
        return this.blockSupply;
    }

    toJson() {
        return {
            numWindows: this.numWindows,
            windows: this.windows.map(window => window.toJson()),
            blockSupply: this.blockSupply.toJson()
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

        // If windows data is provided, deserialize each window
        if (jsonData.windows && Array.isArray(jsonData.windows)) {
            state.windows = jsonData.windows.map(windowData => Window.fromJson(windowData));
        }

        // If block supply data is provided, deserialize it
        if (jsonData.blockSupply) {
            state.blockSupply = BlockSupply.fromJson(jsonData.blockSupply);
        }

        return state;
    }
} 