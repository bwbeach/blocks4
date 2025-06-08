/**
 * Glass Block Designer Application
 */

import { State } from './state.js';

// Global state instance
let appState = new State();

$(function () {
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
    updateDesignDetails();
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

    // Create input fields for each window's dimensions
    let html = '';
    const windows = appState.getWindows();

    for (let i = 0; i < windows.length; i++) {
        const window = windows[i];
        html += `
            <div class="window-config">
                <h4>Window ${i + 1}</h4>
                <div class="size-inputs">
                    <label for="window-${i}-width">Width:</label>
                    <input type="number" id="window-${i}-width" min="1" max="100" value="${window.getWidth()}">
                    <label for="window-${i}-height">Height:</label>
                    <input type="number" id="window-${i}-height" min="1" max="100" value="${window.getHeight()}">
                </div>
            </div>
        `;
    }

    container.html(html);

    // Add event listeners for the new inputs
    for (let i = 0; i < windows.length; i++) {
        $(`#window-${i}-width`).on('change', function () {
            updateWindowDimension(i, 'width', parseInt($(this).val()));
        });

        $(`#window-${i}-height`).on('change', function () {
            updateWindowDimension(i, 'height', parseInt($(this).val()));
        });
    }

    console.log('State updated - Number of windows:', appState.getNumWindows());

    // Update design details whenever state changes
    updateDesignDetails();
}

function updateColorSetup() {
    const numColors = parseInt($('#num-colors').val());
    const container = $('#color-setup');

    // TODO: Create color picker and quantity inputs
    container.html('<p>Color setup will be implemented here</p>');
}

function updateWindowDimension(windowIndex, dimension, value) {
    try {
        const windows = appState.getWindows();
        const window = windows[windowIndex];

        if (dimension === 'width') {
            window.setWidth(value);
        } else if (dimension === 'height') {
            window.setHeight(value);
        }

        // Update design details when dimensions change
        updateDesignDetails();

    } catch (error) {
        // Reset input to previous valid value on validation error
        const windows = appState.getWindows();
        const window = windows[windowIndex];
        const currentValue = dimension === 'width' ? window.getWidth() : window.getHeight();
        $(`#window-${windowIndex}-${dimension}`).val(currentValue);

        alert(`Invalid ${dimension}: ${error.message}`);
    }
}

function updateDesignDetails() {
    const stateJson = appState.toJson();
    const jsonString = JSON.stringify(stateJson, null, 2);
    $('#design-output').val(jsonString);
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