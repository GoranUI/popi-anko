// Main navigation
document.getElementById('diaper-btn').addEventListener('click', () => showOptions('diaper-options'));
document.getElementById('boob-btn').addEventListener('click', () => showOptions('boob-options'));

// Diaper options
document.getElementById('poop-btn').addEventListener('click', () => toggleSubOptions('poop'));
document.getElementById('pee-btn').addEventListener('click', () => toggleSubOptions('pee'));
document.getElementById('both-btn').addEventListener('click', () => toggleSubOptions('both'));

function showOptions(optionsId) {
    const allOptions = document.querySelectorAll('.options');
    allOptions.forEach(option => option.classList.add('hidden'));
    document.getElementById(optionsId).classList.remove('hidden');
}

function toggleSubOptions(type) {
    const poopOptions = document.getElementById('poop-options');
    const peeOptions = document.getElementById('pee-options');
    const logButton = document.getElementById('log-diaper-btn');

    if (type === 'poop' || type === 'both') {
        poopOptions.classList.remove('hidden');
    } else {
        poopOptions.classList.add('hidden');
    }

    if (type === 'pee' || type === 'both') {
        peeOptions.classList.remove('hidden');
    } else {
        peeOptions.classList.add('hidden');
    }

    logButton.classList.remove('hidden');
    logButton.textContent = `Log ${type.charAt(0).toUpperCase() + type.slice(1)}`;
}

// Color selection
let selectedPoopColor = '';
let selectedPeeColor = '';

document.querySelectorAll('.color-button').forEach(button => {
    button.addEventListener('click', function() {
        const colorType = this.classList.contains('poop-color') ? 'poop' : 'pee';
        if (colorType === 'poop') {
            selectedPoopColor = this.getAttribute('data-color');
            document.querySelectorAll('.poop-color').forEach(btn => btn.classList.remove('selected'));
        } else {
            selectedPeeColor = this.getAttribute('data-color');
            document.querySelectorAll('.pee-color').forEach(btn => btn.classList.remove('selected'));
        }
        this.classList.add('selected');
    });
});

// Logging functions
document.getElementById('log-diaper-btn').addEventListener('click', logDiaperChange);

function logDiaperChange() {
    const type = document.getElementById('log-diaper-btn').textContent.split(' ')[1].toLowerCase();
    
    if (type === 'both' && (!selectedPoopColor || !selectedPeeColor)) {
        alert('Please select both poop and pee colors.');
        return;
    } else if ((type === 'poop' && !selectedPoopColor) || (type === 'pee' && !selectedPeeColor)) {
        alert(`Please select a ${type} color.`);
        return;
    }

    const timestamp = new Date().toLocaleString();
    let log;

    if (type === 'both') {
        log = { 
            type: 'Both', 
            poopColor: selectedPoopColor, 
            peeColor: selectedPeeColor, 
            timestamp 
        };
    } else {
        log = { 
            type: type.charAt(0).toUpperCase() + type.slice(1), 
            color: type === 'poop' ? selectedPoopColor : selectedPeeColor, 
            timestamp 
        };
    }

    saveLog(log);
    updateLogDisplay(log);
    resetDiaperOptions();
}

function resetDiaperOptions() {
    selectedPoopColor = '';
    selectedPeeColor = '';
    document.querySelectorAll('.color-button').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.sub-options').forEach(option => option.classList.add('hidden'));
    document.getElementById('log-diaper-btn').classList.add('hidden');
}

// Breastfeeding logging
let feedingStartTime = null;
let stopwatchInterval = null;

document.getElementById('start-boob-btn').addEventListener('click', startFeeding);
document.getElementById('stop-boob-btn').addEventListener('click', stopFeeding);

function startFeeding() {
    feedingStartTime = new Date();
    document.getElementById('start-boob-btn').classList.add('hidden');
    document.getElementById('stop-boob-btn').classList.remove('hidden');
    startStopwatch();
}

function stopFeeding() {
    clearInterval(stopwatchInterval);
    const endTime = new Date();
    const duration = Math.round((endTime - feedingStartTime) / 1000 / 60); // minutes
    const log = {
        type: 'Breastfeeding',
        startTime: feedingStartTime.toLocaleString(),
        endTime: endTime.toLocaleString(),
        duration: duration
    };
    saveLog(log);
    updateLogDisplay(log);
    document.getElementById('start-boob-btn').classList.remove('hidden');
    document.getElementById('stop-boob-btn').classList.add('hidden');
    document.getElementById('stopwatch').textContent = '00:00';
}

function startStopwatch() {
    let secondsElapsed = 0;
    stopwatchInterval = setInterval(function() {
        secondsElapsed++;
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed % 60;
        document.getElementById('stopwatch').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// Save log to local storage
function saveLog(log) {
    let logs = JSON.parse(localStorage.getItem('babyLogs')) || [];
    logs.push(log);
    localStorage.setItem('babyLogs', JSON.stringify(logs));
}

// Update log display
function updateLogDisplay(log) {
    const logContainer = document.getElementById('log-container');
    const logEntry = document.createElement('div');
    logEntry.classList.add('log-entry');
    
    if (log.type === 'Breastfeeding') {
        logEntry.innerHTML = `<strong>${log.type}</strong>: ${log.duration} minutes (${log.startTime})`;
    } else if (log.type === 'Both') {
        logEntry.innerHTML = `<strong>Poop and Pee</strong>: Poop - ${log.poopColor}, Pee - ${log.peeColor} (${log.timestamp})`;
    } else {
        logEntry.innerHTML = `<strong>${log.type}</strong>: ${log.color} (${log.timestamp})`;
    }
    
    logContainer.insertBefore(logEntry, logContainer.firstChild);
}

// Load logs on page load
window.onload = function() {
    let logs = JSON.parse(localStorage.getItem('babyLogs')) || [];
    logs.forEach(updateLogDisplay);
};