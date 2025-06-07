/**
 * State class to hold the entire application state
 */
class State {
    constructor() {
        this.numWindows = 1;
    }

    setNumWindows(count) {
        this.numWindows = count;
    }

    getNumWindows() {
        return this.numWindows;
    }
} 