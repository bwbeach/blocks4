/**
 * Glass Block Designer Application
 */

import { State } from './state.js';

// Global state instance
let appState = new State();

$(document).ready(function () {
    console.log('Glass Block Designer loaded');

    // Initialize the application
    init();
});

function init() {
    // Set up event listeners
    setupEventListeners();

    // Initialize with default values
    updateWindowSetup();
    updateColorSetup();
}

function setupEventListeners() {
    $('#num-windows').on('change', updateWindowSetup);
    $('#num-colors').on('change', updateColorSetup);
    $('#copy-design').on('click', copyDesignToClipboard);
}

function updateWindowSetup() {
    const numWindows = parseInt($('#num-windows').val());
    appState.setNumWindows(numWindows);

    const container = $('#window-sizes');

    // TODO: Create input fields for each window's dimensions
    container.html(`<p>Window setup will be implemented here (${appState.getNumWindows()} windows)</p>`);

    console.log('State updated - Number of windows:', appState.getNumWindows());
}

function updateColorSetup() {
    const numColors = parseInt($('#num-colors').val());
    const container = $('#color-setup');

    // TODO: Create color picker and quantity inputs
    container.html('<p>Color setup will be implemented here</p>');
}

function copyDesignToClipboard() {
    const designText = $('#design-output').val();
    if (designText) {
        navigator.clipboard.writeText(designText).then(() => {
            alert('Design copied to clipboard!');
        }).catch(() => {
            alert('Could not copy to clipboard. Please select and copy manually.');
        });
    } else {
        alert('No design to copy yet.');
    }
} 