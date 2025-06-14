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
    try {
        appState.getBlockSupply().setNumColors(numColors);
    } catch (error) {
        // Reset input to previous valid value on validation error
        const currentValue = appState.getBlockSupply().getNumColors();
        $('#num-colors').val(currentValue);
        alert(`Invalid number of colors: ${error.message}`);
        return;
    }

    const container = $('#color-setup');
    const blockSupply = appState.getBlockSupply();
    const colors = blockSupply.getColors();
    const blockCounts = blockSupply.getBlockCounts();

    // Create color picker and block count input for each color
    let html = '';
    for (let i = 0; i < colors.length; i++) {
        html += `
            <div class="color-config">
                <h4>Color ${i + 1}</h4>
                <div class="color-inputs">
                    <label for="color-${i}">Color:</label>
                    <input type="color" id="color-${i}" value="${colors[i]}">
                    <label for="block-count-${i}">Number of blocks:</label>
                    <input type="number" id="block-count-${i}" min="0" value="${blockCounts[i]}">
                </div>
            </div>
        `;
    }

    container.html(html);

    // Add event listeners for the new inputs
    for (let i = 0; i < colors.length; i++) {
        $(`#color-${i}`).on('change', function () {
            try {
                blockSupply.setColor(i, $(this).val());
                updateDesignDetails();
            } catch (error) {
                // Reset input to previous valid value on validation error
                $(this).val(blockSupply.getColor(i));
                alert(`Invalid color: ${error.message}`);
            }
        });

        $(`#block-count-${i}`).on('change', function () {
            try {
                blockSupply.setBlockCount(i, parseInt($(this).val()));
                updateDesignDetails();
            } catch (error) {
                // Reset input to previous valid value on validation error
                $(this).val(blockSupply.getBlockCount(i));
                alert(`Invalid block count: ${error.message}`);
            }
        });
    }

    console.log('State updated - Number of colors:', blockSupply.getNumColors());
    updateDesignDetails();
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