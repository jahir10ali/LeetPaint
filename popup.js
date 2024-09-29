// Initial state
let isEnabled = false;

// Get the toggle switch
const toggleSwitch = document.getElementById('toggleSwitch');

toggleSwitch.addEventListener('change', () => {
    isEnabled = toggleSwitch.checked; // Update the state based on switch

    if (isEnabled) {
        // Logic to enable the extension functionality
        console.log("Extension enabled");
    } else {
        // Logic to disable the extension functionality
        console.log("Extension disabled");
    }
});
