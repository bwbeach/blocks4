/**
 * State class to hold the entire application state
 */
export class State {
    constructor() {
        this.numWindows = 1;
    }

    setNumWindows(count) {
        if (!Number.isInteger(count)) {
            throw new Error('Number of windows must be an integer');
        }
        if (count < 1 || count > 20) {
            throw new Error('Number of windows must be between 1 and 20');
        }
        this.numWindows = count;
    }

    getNumWindows() {
        return this.numWindows;
    }

    toJson() {
        return {
            numWindows: this.numWindows
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

        return state;
    }
} 