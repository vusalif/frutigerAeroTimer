let slideshowInterval = null;
let currentImageIndex = 0;
// Define constant array of image paths
const SLIDESHOW_IMAGES = [
    'imgs/16_9-frutiger-aero-1.png',
    'imgs/16_9-frutiger-aero-2.png',
    'imgs/16_9-frutiger-aero-3.png',
    'imgs/16_9-frutiger-aero-4.png',
    'imgs/16_9-frutiger-aero-5.png',
    'imgs/16_9-frutiger-aero-6.png',
    'imgs/16_9-frutiger-aero-7.png',
    'imgs/16_9-frutiger-aero-8.png',
    'imgs/16_9-frutiger-aero-9.png',
    'imgs/16_9-frutiger-aero-10.png',
    'imgs/16_9-frutiger-aero-11.png',
    'imgs/16_9-frutiger-aero-12.png',
    'imgs/16_9-frutiger-aero-13.png',
    'imgs/16_9-frutiger-aero-14.png',
    'imgs/16_9-frutiger-aero-15.png',
    'imgs/16_9-frutiger-aero-16.png',
    'imgs/16_9-frutiger-aero-17.png',
    'imgs/16_9-frutiger-aero-18.png',
    'imgs/16_9-frutiger-aero-19.png',
    'imgs/16_9-frutiger-aero-20.png',
    'imgs/16_9-frutiger-aero-21.png',
    'imgs/16_9-frutiger-aero-22.png',
    'imgs/16_9-frutiger-aero-23.png',
    'imgs/16_9-frutiger-aero-24.png',
    'imgs/16_9-frutiger-aero-25.png',
    'imgs/16_9-frutiger-aero-26.png',
    'imgs/16_9-frutiger-aero-27.png',
    'imgs/16_9-frutiger-aero-28.png',
    'imgs/16_9-frutiger-aero-29.png',
    'imgs/16_9-frutiger-aero-30.png',
    'imgs/16_9-frutiger-aero-30.png',
    'imgs/16_9-frutiger-aero-31.png',
    'imgs/16_9-frutiger-aero-32.png',
    'imgs/16_9-frutiger-aero-33.png',
    'imgs/16_9-frutiger-aero-34.png',
    'imgs/16_9-frutiger-aero-35.png',
    'imgs/16_9-frutiger-aero-36.png',
    'imgs/16_9-frutiger-aero-37.png',
    'imgs/16_9-frutiger-aero-38.png',
    'imgs/16_9-frutiger-aero-39.png',
    'imgs/16_9-frutiger-aero-40.png',
    'imgs/16_9-frutiger-aero-41.png',
    'imgs/16_9-frutiger-aero-42.png',
    'imgs/16_9-frutiger-aero-43.png',
    'imgs/16_9-frutiger-aero-44.png',
    'imgs/16_9-frutiger-aero-45.png',
    'imgs/16_9-frutiger-aero-46.png',
    'imgs/16_9-frutiger-aero-47.png',
    'imgs/16_9-frutiger-aero-48.png',
    'imgs/16_9-frutiger-aero-49.png',
    'imgs/16_9-frutiger-aero-50.png',
    'imgs/16_9-frutiger-aero-51.png',
    'imgs/16_9-frutiger-aero-52.png',
    'imgs/16_9-frutiger-aero-53.png',
    'imgs/16_9-frutiger-aero-54.png',
    'imgs/16_9-frutiger-aero-254.png'
];



class Timer {
    constructor() {
        this.isRunning = false;
        this.startTime = 0;
        this.overallTime = 0;
    }

    _getTimeElapsedSinceLastStart() {
        if (!this.startTime) {
            return 0;
        }
        return Date.now() - this.startTime;
    }

    start() {
        if (this.isRunning) {
            return console.error('Timer is already running');
        }

        this.isRunning = true;
        this.startTime = Date.now();
    }

    stop() {
        if (!this.isRunning) {
            return console.error('Timer is already stopped');
        }

        this.isRunning = false;
        this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
    }

    reset() {
        this.overallTime = 0;
        this.startTime = 0;
        this.isRunning = false;
    }

    getTime() {
        if (!this.startTime) {
            return 0;
        }

        if (this.isRunning) {
            return this.overallTime + this._getTimeElapsedSinceLastStart();
        }

        return this.overallTime;
    }
}

// Pomodoro Timer
let timeLeft;
let timerId = null;
let pomodoroTime = 25 * 60;
let shortBreakTime = 5 * 60;
let longBreakTime = 15 * 60;

// Add these variables at the top
let autoStartBreaks = false;
let longBreakInterval = 4;
let soundEnabled = true;
let notificationVolume = 0.5;
let sessionCount = 0;
currentImageIndex = 1;
// Add at the top with other variables
const SOUNDS = {
    click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
    complete: new Audio('../frutigerRadio/sound-effects/alarm.wav'),
    switch: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
    taskComplete: new Audio('../frutigerRadio/sound-effects/task complete.wav')
};

// Update the playClickSound function
function playClickSound() {
    if (soundEnabled) {
        const clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
        clickSound.volume = notificationVolume;
        clickSound.play().catch(err => console.log('Click sound failed:', err));
    }
}
// Update the addClickSoundToButtons function
function addClickSoundToButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') {
            playClickSound();
        }
    });
}

// Update the updateTimer function
function updateTimer() {
    // Ensure timeLeft doesn't go below 0
    timeLeft = Math.max(0, timeLeft);
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Add these variables at the top with other timer variables
let timerStartTime = null;
let initialTimeLeft = null;

// Add these variables at the top with other timer variables
let originalTitle = document.title;
let titleInterval = null;

// Add this function to request notification permissions
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}

// Add this function to update the page title
function updateTitle() {
    if (timeLeft > 0) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `(${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')})`;
        document.title = `${timeString} - ${originalTitle}`;
    } else {
        document.title = originalTitle;
    }
}

// Add this function to flash the title when timer completes
function flashTitle(message) {
    let isOriginal = false;
    titleInterval = setInterval(() => {
        document.title = isOriginal ? originalTitle : message;
        isOriginal = !isOriginal;
    }, 1000);

    // Stop flashing after 10 seconds
    setTimeout(() => {
        if (titleInterval) {
            clearInterval(titleInterval);
            titleInterval = null;
            document.title = originalTitle;
        }
    }, 10000);
}

// Update the startTimer function to include title updates
function startTimer() {
    if (timerId === null) {
        // Don't start if timer is already at 0
        if (timeLeft <= 0) {
            return;
        }
        
        timerStartTime = Date.now();
        initialTimeLeft = timeLeft;
        
        timerId = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - timerStartTime) / 1000);
            timeLeft = Math.max(0, initialTimeLeft - elapsedSeconds);
            
            updateTimer();
            updateProgressBar();
            updateTitle(); // Add title update
            
            if (timeLeft <= 0) {
                clearInterval(timerId);
                timerId = null;
                timeLeft = 0;
                updateTimer();
                updateProgressBar();
                onTimerComplete();
                return;
            }
        }, 100);
    }
}

// Update the pauseTimer function
function pauseTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        // Save the current timeLeft when pausing
        timeLeft = Math.max(0, timeLeft);
        updateTimer();
        updateProgressBar();
    }
}

// Update the resetTimer function
function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timerStartTime = null;
    initialTimeLeft = null;
    timeLeft = pomodoroTime;
    updateTimer();
    updateProgressBar();
}

function loadSettings() {
    const savedPomodoro = localStorage.getItem('pomodoroDuration');
    const savedShortBreak = localStorage.getItem('shortBreakDuration');
    const savedLongBreak = localStorage.getItem('longBreakDuration');

    if (savedPomodoro) {
        pomodoroTime = parseInt(savedPomodoro) * 60;
        document.getElementById('pomodoro-duration').value = savedPomodoro;
    }
    if (savedShortBreak) {
        shortBreakTime = parseInt(savedShortBreak) * 60;
        document.getElementById('short-break-duration').value = savedShortBreak;
    }
    if (savedLongBreak) {
        longBreakTime = parseInt(savedLongBreak) * 60;
        document.getElementById('long-break-duration').value = savedLongBreak;
    }

    timeLeft = pomodoroTime;
    updateTimer();

    // Load additional settings
    autoStartBreaks = localStorage.getItem('autoStartBreaks') === 'true';
    document.getElementById('auto-start-breaks').checked = autoStartBreaks;
    
    const savedInterval = localStorage.getItem('longBreakInterval');
    if (savedInterval) {
        longBreakInterval = parseInt(savedInterval);
        document.getElementById('long-break-interval').value = longBreakInterval;
    }
    
    soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    document.getElementById('sound-enabled').checked = soundEnabled;
    
    const savedVolume = localStorage.getItem('notificationVolume');
    if (savedVolume) {
        notificationVolume = parseFloat(savedVolume);
        document.getElementById('notification-volume').value = notificationVolume * 100;
        updateVolumeDisplay();
    }
}

function saveSettings() {
    const newPomodoro = document.getElementById('pomodoro-duration').value;
    const newShortBreak = document.getElementById('short-break-duration').value;
    const newLongBreak = document.getElementById('long-break-duration').value;

    localStorage.setItem('pomodoroDuration', newPomodoro);
    localStorage.setItem('shortBreakDuration', newShortBreak);
    localStorage.setItem('longBreakDuration', newLongBreak);

    pomodoroTime = parseInt(newPomodoro) * 60;
    shortBreakTime = parseInt(newShortBreak) * 60;
    longBreakTime = parseInt(newLongBreak) * 60;

    // Color settings
    saveColorSettings();

    // Reset timer and hide panel
    timeLeft = pomodoroTime;
    updateTimer();
    document.getElementById('settings-panel').style.display = 'none';

    // Save additional settings
    localStorage.setItem('autoStartBreaks', autoStartBreaks);
    localStorage.setItem('longBreakInterval', longBreakInterval);
    localStorage.setItem('soundEnabled', soundEnabled);
    localStorage.setItem('notificationVolume', notificationVolume);
}

// Stopwatch
const stopwatch = new Timer();
let stopwatchInterval;
let lapTimes = [];

function updateStopwatchDisplay() {
    const time = stopwatch.getTime();
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    document.getElementById('stopwatch').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function addTemporaryActiveClass(button) {
    button.classList.add('active');
    setTimeout(() => {
        button.classList.remove('active');
    }, 500); // 3 seconds
}
function SlideShowStartBG() {
    // Clear any existing interval
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }

    // Function to select and display random image
    function displayRandomImage() {
        currentImageIndex = Math.floor(Math.random() * SLIDESHOW_IMAGES.length);
        document.body.style.backgroundImage = `url(${SLIDESHOW_IMAGES[currentImageIndex]})`;
    }

    // Show first image immediately
    displayRandomImage();

    // Set interval for subsequent images
    slideshowInterval = setInterval(displayRandomImage, 10000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    timeLeft = pomodoroTime;
    updateTimer();
    

    // Pomodoro Timer Controls
    document.getElementById('start').addEventListener('click', () => {
        startTimer();
        addTemporaryActiveClass(document.getElementById('start'));
    });

    document.getElementById('pause').addEventListener('click', () => {
        pauseTimer();
        addTemporaryActiveClass(document.getElementById('pause'));
    });

    document.getElementById('reset').addEventListener('click', () => {
        resetTimer();
        addTemporaryActiveClass(document.getElementById('reset'));
    });

    document.getElementById('pomodoro').addEventListener('click', () => {
        timeLeft = pomodoroTime;
        updateTimer();
        
        document.getElementById('pomodoro').classList.add('active');
        document.getElementById('shortBreak').classList.remove('active');
        document.getElementById('longBreak').classList.remove('active');
        
        if (soundEnabled) {
            SOUNDS.switch.volume = notificationVolume;
            SOUNDS.switch.currentTime = 0;
            SOUNDS.switch.play().catch(err => console.log('Switch sound failed:', err));
        }
        showNotification('Pomodoro mode activated', 'info');
    });

    document.getElementById('shortBreak').addEventListener('click', () => {
        timeLeft = shortBreakTime;
        updateTimer();
        
        document.getElementById('pomodoro').classList.remove('active');
        document.getElementById('shortBreak').classList.add('active');
        document.getElementById('longBreak').classList.remove('active');
        
        if (soundEnabled) {
            SOUNDS.switch.volume = notificationVolume;
            SOUNDS.switch.currentTime = 0;
            SOUNDS.switch.play().catch(err => console.log('Switch sound failed:', err));
        }
        showNotification('Short break started', 'info');
    });

    document.getElementById('longBreak').addEventListener('click', () => {
        timeLeft = longBreakTime;
        updateTimer();
        
        document.getElementById('pomodoro').classList.remove('active');
        document.getElementById('shortBreak').classList.remove('active');
        document.getElementById('longBreak').classList.add('active');
        
        if (soundEnabled) {
            SOUNDS.switch.volume = notificationVolume;
            SOUNDS.switch.currentTime = 0;
            SOUNDS.switch.play().catch(err => console.log('Switch sound failed:', err));
        }
        showNotification('Long break started', 'info');
    });

    // Stopwatch Controls
    document.getElementById('stopwatch-start').addEventListener('click', () => {
        stopwatch.start();
        stopwatchInterval = setInterval(updateStopwatchDisplay, 1000);
        addTemporaryActiveClass(document.getElementById('stopwatch-start'));
    });

    document.getElementById('stopwatch-pause').addEventListener('click', () => {
        stopwatch.stop();
        clearInterval(stopwatchInterval);
        addTemporaryActiveClass(document.getElementById('stopwatch-pause'));
    });

    document.getElementById('stopwatch-reset').addEventListener('click', () => {
        stopwatch.reset();
        clearInterval(stopwatchInterval);
        updateStopwatchDisplay();
        lapTimes = [];
        updateLapTimesList();
        addTemporaryActiveClass(document.getElementById('stopwatch-reset'));
    });

    // Add Lap Time button handler
    document.getElementById('stopwatch-lap').addEventListener('click', () => {
        const currentTime = stopwatch.getTime();
        
        lapTimes.push({
            lapNumber: lapTimes.length + 1,
            totalTime: currentTime
        });
        
        updateLapTimesList();
        addTemporaryActiveClass(document.getElementById('stopwatch-lap'));
    });

    // Load saved settings
    loadSettings();

    // Settings toggle
    document.getElementById('settings-toggle').addEventListener('click', () => {
        const settingsPanel = document.getElementById('settings-panel');
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Save settings
    document.getElementById('save-settings').addEventListener('click', saveSettings);

    // Validate input values
    const durationInputs = document.querySelectorAll('input[type="number"]');
    durationInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseInt(this.value);
            if (value < parseInt(this.min)) {
                this.value = this.min;
            }
            if (value > parseInt(this.max)) {
                this.value = this.max;
            }
        });
    });

    // Navigation
    document.getElementById('timer-nav').addEventListener('click', () => showSection('timer-section'));
    document.getElementById('stopwatch-nav').addEventListener('click', () => showSection('stopwatch-section'));
    document.getElementById('tasks-nav').addEventListener('click', () => showSection('tasks-section'));

    // Tasks functionality
    const tasksContainer = document.getElementById('tasks-container');
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');

    function addTask(taskData) {
        const li = document.createElement('li');
        li.className = `task-item${taskData.completed ? ' completed' : ''}`;
        
        const timestamp = taskData.timestamp || new Date().toISOString();
        const formattedDate = new Date(timestamp).toLocaleString();
        
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${taskData.completed ? 'checked' : ''}>
            <div class="task-content">
                <div class="task-text">${taskData.text}</div>
                <div class="task-meta">
                    <span class="task-date">${formattedDate}</span>
                    <span class="task-priority priority-${taskData.priority}">${taskData.priority}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="glass-button edit-task">✎</button>
                <button class="glass-button delete-task">×</button>
            </div>
        `;
        
        // Add event listeners
        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
            if (checkbox.checked && soundEnabled) {
                SOUNDS.taskComplete.volume = notificationVolume;
                SOUNDS.taskComplete.currentTime = 0;
                SOUNDS.taskComplete.play().catch(err => console.log('Task complete sound failed:', err));
            }
            saveTasks();
        });
        
        li.querySelector('.edit-task').addEventListener('click', () => {
            const taskText = li.querySelector('.task-text');
            const newText = prompt('Edit task:', taskText.textContent);
            if (newText && newText.trim()) {
                taskText.textContent = newText.trim();
                saveTasks();
            }
        });
        
        li.querySelector('.delete-task').addEventListener('click', () => {
            li.remove();
            saveTasks();
        });
        
        tasksContainer.appendChild(li);
        saveTasks();
    }

    function saveTasks() {
        const tasks = Array.from(tasksContainer.querySelectorAll('.task-item')).map(task => ({
            text: task.querySelector('.task-text').textContent,
            completed: task.classList.contains('completed'),
            priority: task.querySelector('.task-priority').textContent,
            timestamp: new Date(task.querySelector('.task-date').textContent).toISOString()
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            JSON.parse(savedTasks).forEach(task => addTask(task));
        }
    }

    addTaskButton.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        const priority = document.getElementById('task-priority').value;
        if (taskText) {
            addTask({
                text: taskText,
                completed: false,
                priority: priority,
                timestamp: new Date().toISOString()
            });
            newTaskInput.value = '';
        }
    });

    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const taskText = newTaskInput.value.trim();
            const priority = document.getElementById('task-priority').value;
            if (taskText) {
                addTask({
                    text: taskText,
                    completed: false,
                    priority: priority,
                    timestamp: new Date().toISOString()
                });
                newTaskInput.value = '';
            }
        }
    });

    loadTasks();

    // Settings tabs
    document.getElementById('timer-settings-tab').addEventListener('click', () => {
        document.getElementById('timer-settings').style.display = 'block';
        document.getElementById('customize-settings').style.display = 'none';
        document.getElementById('timer-settings-tab').classList.add('active');
        document.getElementById('customize-settings-tab').classList.remove('active');
    });

    document.getElementById('customize-settings-tab').addEventListener('click', () => {
        document.getElementById('timer-settings').style.display = 'none';
        document.getElementById('customize-settings').style.display = 'block';
        document.getElementById('timer-settings-tab').classList.remove('active');
        document.getElementById('customize-settings-tab').classList.add('active');
    });

    // Load color settings
    loadColorSettings();

    // Live color preview
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        input.addEventListener('input', function() {
            const colorVar = `--${this.id.replace('-color', '')}-color`;
            document.documentElement.style.setProperty(colorVar, this.value);
        });
    });

    // Add reset colors button handler
    document.getElementById('reset-colors').addEventListener('click', () => {
        resetColors();
        addTemporaryActiveClass(document.getElementById('reset-colors'));
    });



    // Task filter functionality
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter tasks
            const filter = button.dataset.filter;
            const tasks = document.querySelectorAll('.task-item');
            
            tasks.forEach(task => {
                const isCompleted = task.querySelector('.task-checkbox').checked;
                
                switch(filter) {
                    case 'active':
                        task.style.display = isCompleted ? 'none' : 'flex';
                        break;
                    case 'completed':
                        task.style.display = isCompleted ? 'flex' : 'none';
                        break;
                    default: // 'all'
                        task.style.display = 'flex';
                }
            });
        });
    });




    // Volume slider
    const volumeSlider = document.getElementById('notification-volume');
    volumeSlider.addEventListener('input', function() {
        notificationVolume = this.value / 100;
        updateVolumeDisplay();
    });
    
    // Auto-start breaks toggle
    document.getElementById('auto-start-breaks').addEventListener('change', function() {
        autoStartBreaks = this.checked;
    });
    
    // Long break interval
    document.getElementById('long-break-interval').addEventListener('change', function() {
        longBreakInterval = parseInt(this.value);
    });
    
    // Sound toggle
    document.getElementById('sound-enabled').addEventListener('change', function() {
        soundEnabled = this.checked;
    });

    // Initialize progress bar
    updateProgressBar();

    // Update progress bar when switching modes
    ['pomodoro', 'shortBreak', 'longBreak'].forEach(id => {
        document.getElementById(id).addEventListener('click', () => {
            updateProgressBar();
        });
    });

    // Add click sounds to all buttons
    addClickSoundToButtons();

    // Initialize sound settings
    if (localStorage.getItem('soundEnabled') === null) {
        localStorage.setItem('soundEnabled', 'true');
        soundEnabled = true;
    }
    
    if (localStorage.getItem('notificationVolume') === null) {
        localStorage.setItem('notificationVolume', '0.5');
        notificationVolume = 0.5;
    }

    // Add click sounds to all buttons
    addClickSoundToButtons;


    
 

    // Add at the top with other variables
    let timerActive = false;
    let stopwatchActive = false;
    let hasTasks = false;

    // Update the beforeunload event
    window.addEventListener('beforeunload', (e) => {
        if (timerActive || stopwatchActive || hasTasks) {
            e.preventDefault();
            e.returnValue = 'You have active features running (Timer/Stopwatch/Tasks). Are you sure you want to leave?';
            return e.returnValue;
        }
    });

    // Update Timer controls
    document.getElementById('start').addEventListener('click', function() {
        timerActive = true;
    });

    document.getElementById('pause').addEventListener('click', function() {
        timerActive = false;
    });

    document.getElementById('reset').addEventListener('click', function() {
        timerActive = false;
    });

    // Update Stopwatch controls
    document.getElementById('stopwatch-start').addEventListener('click', function() {
        stopwatchActive = true;
    });

    document.getElementById('stopwatch-pause').addEventListener('click', function() {
        stopwatchActive = false;
    });

    document.getElementById('stopwatch-reset').addEventListener('click', function() {
        stopwatchActive = false;
    });

    // Update Task handling
    document.getElementById('add-task').addEventListener('click', function() {
        // ... existing task adding code ...
        const tasksList = document.getElementById('tasks-container');
        hasTasks = tasksList.children.length > 0;
    });

    // Update task completion/deletion
    function updateTaskStatus() {
        const tasksList = document.getElementById('tasks-container');
        hasTasks = tasksList.children.length > 0;
    }

    // Add to task deletion handler
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-task')) {
            e.target.closest('.task-item').remove();
            updateTaskStatus();
        }
    });

    // Add to task completion handler
 document.addEventListener('change', function(e) {
    if (e.target.classList.contains('task-checkbox')) {
        const taskItem = e.target.closest('.task-item');
        if (e.target.checked) {
            taskItem.classList.add('completed');
        } else {
            taskItem.classList.remove('completed');
        }
        
        // Reapply current filter
        const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
        if (currentFilter !== 'all') {
            taskItem.style.display = (currentFilter === 'completed') === e.target.checked ? 'flex' : 'none';
        }
        
        updateTaskStatus();
    }
});

    // Start button click handler
    document.getElementById('start-button').addEventListener('click', () => {
        showSection('game-section');
        document.getElementById('game-nav').classList.add('active');
        document.querySelectorAll('.nav-button').forEach(btn => {
            if (btn.id !== 'game-nav') btn.classList.remove('active');
        });
        if (!gameInitialized) {
            initGame();
            gameInitialized = true;
        }
    });

    // Game initialization flag
    let gameInitialized = false;

    // Game window elements
    const gameWindow = document.getElementById('gameWindow');
    const gameDragHandle = document.getElementById('gameDragHandle');
    const minimizeGame = document.getElementById('minimizeGame');
    const closeGame = document.getElementById('closeGame');

    // Game window controls
    minimizeGame.addEventListener('click', () => {
        gameWindow.style.display = 'none';
    });

    closeGame.addEventListener('click', () => {
        gameWindow.style.display = 'none';
    });

    // Make game window draggable
    let isDraggingGame = false;
    let currentGameX;
    let currentGameY;
    let initialGameX;
    let initialGameY;

    gameDragHandle.addEventListener('mousedown', startDraggingGame);
    document.addEventListener('mousemove', dragGame);
    document.addEventListener('mouseup', stopDraggingGame);

    function startDraggingGame(e) {
        isDraggingGame = true;
        initialGameX = gameWindow.offsetLeft;
        initialGameY = gameWindow.offsetTop;
        currentGameX = e.clientX;
        currentGameY = e.clientY;
    }

    function dragGame(e) {
        if (isDraggingGame) {
            e.preventDefault();
            const deltaX = e.clientX - currentGameX;
            const deltaY = e.clientY - currentGameY;
            
            const newX = initialGameX + deltaX;
            const newY = initialGameY + deltaY;
            
            gameWindow.style.left = newX + 'px';
            gameWindow.style.top = newY + 'px';
            gameWindow.style.transform = 'none';
        }
    }

    function stopDraggingGame() {
        isDraggingGame = false;
    }

    function initGame() {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');

        // Set canvas size
        canvas.width = 800;
        canvas.height = 400;

        // Game objects
        const ball = {
            x: canvas.width / 2,
            y: canvas.height - 30,
            dx: 5,
            dy: -5,
            radius: 8,
            speed: 7
        };

        const paddle = {
            width: 100,
            height: 10,
            x: canvas.width / 2 - 50,
            speed: 7
        };

        const brickRowCount = 5;
        const brickColumnCount = 8;
        const brickWidth = 80;
        const brickHeight = 20;
        const brickPadding = 10;
        const brickOffsetTop = 60;
        const brickOffsetLeft = 60;

        let score = 0;
        let rightPressed = false;
        let leftPressed = false;
        let gameStarted = false;

        // Create bricks
        const bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        // Event listeners
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);
        canvas.addEventListener('mousemove', mouseMoveHandler);
        canvas.addEventListener('click', () => {
            if (!gameStarted && gameWindow.style.display !== 'none') {
                gameStarted = true;
                ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
                ball.dy = -ball.speed;
            }
        });

        function keyDownHandler(e) {
            if (gameWindow.style.display !== 'none') {
                if (e.key === 'Right' || e.key === 'ArrowRight') {
                    rightPressed = true;
                } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                    leftPressed = true;
                }
            }
        }

        function keyUpHandler(e) {
            if (e.key === 'Right' || e.key === 'ArrowRight') {
                rightPressed = false;
            } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                leftPressed = false;
            }
        }

        function mouseMoveHandler(e) {
            if (gameWindow.style.display !== 'none') {
                const relativeX = e.clientX - canvas.offsetLeft - gameWindow.offsetLeft;
                if (relativeX > 0 && relativeX < canvas.width) {
                    paddle.x = relativeX - paddle.width / 2;
                }
            }
        }

        function collisionDetection() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    const b = bricks[c][r];
                    if (b.status === 1) {
                        if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                            ball.dy = -ball.dy;
                            b.status = 0;
                            score++;
                            scoreElement.textContent = score;

                            if (score === brickRowCount * brickColumnCount) {
                                alert('Congratulations! You win!');
                                resetGame();
                            }
                        }
                    }
                }
            }
        }

        function drawBall() {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#3ba9ee';
            ctx.fill();
            ctx.closePath();
        }

        function drawPaddle() {
            ctx.beginPath();
            ctx.roundRect(paddle.x, canvas.height - paddle.height - 10, paddle.width, paddle.height, 5);
            ctx.fillStyle = '#2c3e50';
            ctx.fill();
            ctx.closePath();
        }

        function drawBricks() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].status === 1) {
                        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        
                        ctx.beginPath();
                        ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 5);
                        ctx.fillStyle = `hsl(${c * 30 + r * 20}, 70%, 60%)`;
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }

        function resetGame() {
            score = 0;
            scoreElement.textContent = score;
            gameStarted = false;
            ball.x = canvas.width / 2;
            ball.y = canvas.height - 30;
            paddle.x = canvas.width / 2 - paddle.width / 2;
            
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    bricks[c][r].status = 1;
                }
            }
        }

        function draw() {
            if (gameWindow.style.display !== 'none') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawBricks();
                drawBall();
                drawPaddle();
                collisionDetection();

                if (!gameStarted) {
                    ball.x = paddle.x + paddle.width / 2;
                    ball.y = canvas.height - paddle.height - 20;
                    ctx.fillStyle = '#666';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Click to Start', canvas.width / 2, canvas.height / 2);
                    requestAnimationFrame(draw);
                    return;
                }

                if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
                    ball.dx = -ball.dx;
                }
                if (ball.y + ball.dy < ball.radius) {
                    ball.dy = -ball.dy;
                } else if (ball.y + ball.dy > canvas.height - ball.radius - paddle.height - 10) {
                    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                        const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
                        ball.dx = hitPos * ball.speed;
                        ball.dy = -ball.speed;
                    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
                        alert('Game Over');
                        resetGame();
                    }
                }

                if (rightPressed && paddle.x < canvas.width - paddle.width) {
                    paddle.x += paddle.speed;
                } else if (leftPressed && paddle.x > 0) {
                    paddle.x -= paddle.speed;
                }

                if (paddle.x < 0) paddle.x = 0;
                if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

                ball.x += ball.dx;
                ball.y += ball.dy;
            }
            requestAnimationFrame(draw);
        }

        draw();
    }



    // Handle wallpaper option clicks
    document.querySelectorAll('.wallpaper-option').forEach(option => {
        option.addEventListener('click', () => {
            const type = option.dataset.type;
            const videoFile = option.dataset.video;
            const backgroundContainer = document.querySelector('.background-container');

    
            if (type === 'solid-color') {
                // Get the current gradient colors from the color inputs
                const primaryColor = document.getElementById('primary-color').value;
                const secondaryColor = document.getElementById('secondary-color').value;
                
                // Apply gradient with selected colors
                backgroundContainer.innerHTML = '';
                backgroundContainer.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
                document.body.style.backgroundImage = 'none';
            } else if (type === 'slideshow') {
                // Start slideshow
             //   backgroundContainer.innerHTML = '';
//                backgroundContainer.style.background = 'none';
                SlideShowStartBG();
            } else if (videoFile) {
                // Handle video backgrounds
                document.body.style.backgroundImage = 'none';
                backgroundContainer.style.background = 'none';
                backgroundContainer.innerHTML = `
                    <video autoplay muted loop playsinline>
                        <source src="imgs/${videoFile}" type="video/mp4">
                    </video>
                `;
            }
    
            wallpaperPanel.style.display = 'none';
        });
    });
    
    const startButton = document.getElementById('start-button');
    const wallpaperButton = document.getElementById('wallpaper-button');
    const wallpaperPanel = document.querySelector('.wallpaper-panel');
    const closeWallpaperButton = document.getElementById('close-wallpaper');

    // Then add the event listeners for wallpaper functionality
    wallpaperButton.addEventListener('click', () => {
        wallpaperPanel.style.display = wallpaperPanel.style.display === 'none' ? 'block' : 'none';
    });

    closeWallpaperButton.addEventListener('click', () => {
        wallpaperPanel.style.display = 'none';
    });

    document.addEventListener('click', (e) => {
        if (!wallpaperPanel.contains(e.target) && 
            !wallpaperButton.contains(e.target) && 
            wallpaperPanel.style.display === 'block') {
            wallpaperPanel.style.display = 'none';
        }
    });

    // Handle wallpaper option clicks
    document.querySelectorAll('.wallpaper-option').forEach(option => {
        option.addEventListener('click', () => {
            const type = option.dataset.type;
            const videoFile = option.dataset.video;
            const backgroundContainer = document.querySelector('.background-container');

            if (type === 'solid-color') {
                // Get the current gradient colors from the color inputs
                const primaryColor = document.getElementById('primary-color').value;
                const secondaryColor = document.getElementById('secondary-color').value;
                
                // Apply gradient with selected colors
                backgroundContainer.innerHTML = '';
                backgroundContainer.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
                document.body.style.backgroundImage = 'none';
            } else if (type === 'slideshow') {
                // Start slideshow
                backgroundContainer.innerHTML = '';
                backgroundContainer.style.background = 'none';

                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundRepeat = 'no-repeat';
                SlideShowStartBG();
            } else if (videoFile) {
                // Handle video backgrounds
                document.body.style.backgroundImage = 'none';
                backgroundContainer.style.background = 'none';
                backgroundContainer.innerHTML = `
                    <video autoplay muted loop playsinline>
                        <source src="imgs/${videoFile}" type="video/mp4">
                    </video>
                `;
            }

            wallpaperPanel.style.display = 'none';
        });
    });

    // Add color input change listeners to update gradient in real-time
    document.getElementById('primary-color').addEventListener('input', updateGradient);
    document.getElementById('secondary-color').addEventListener('input', updateGradient);

    function updateGradient() {
        const backgroundContainer = document.querySelector('.background-container');
        // Only update if solid color background is active (no video or slideshow)
        if (!backgroundContainer.querySelector('video') && !document.body.style.backgroundImage) {
            const primaryColor = document.getElementById('primary-color').value;
            const secondaryColor = document.getElementById('secondary-color').value;
            backgroundContainer.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
        }
    }

    // Add to loadColorSettings function
    function loadColorSettings() {
        const colors = ['primary', 'secondary', 'background', 'text'];
        colors.forEach(color => {
            const savedColor = localStorage.getItem(`${color}Color`);
            if (savedColor) {
                document.documentElement.style.setProperty(`--${color}-color`, savedColor);
                document.getElementById(`${color}-color`).value = savedColor;
            }
        });
        // Update gradient if solid color background is active
        updateGradient();
    }

    // Make taskbar buttons toggle active state
    document.querySelectorAll('.taskbar-button').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.taskbar-button').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to clicked button
            button.classList.add('active');
        });
    });

    // Add these variables at the top of your script

});

function showSection(sectionId) {
    // Get all sections
    const sections = ['timer-section', 'stopwatch-section', 'tasks-section'];
    
    // Hide all sections
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = 'none';
        }
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    // Update active state of nav buttons
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(sectionId.replace('-section', '-nav'))?.classList.add('active');
}

function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateLapTimesList() {
    const lapList = document.getElementById('lap-times-list');
    lapList.innerHTML = '';
    
    lapTimes.forEach(lap => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>Lap ${lap.lapNumber}</span>
            <span>${formatTime(lap.totalTime)}</span>
        `;
        lapList.insertBefore(li, lapList.firstChild);
    });
}

function updateVolumeDisplay() {
    const volumeValue = document.querySelector('.volume-value');
    volumeValue.textContent = `${Math.round(notificationVolume * 100)}%`;
}

// Update the timer completion to handle auto-start breaks
function onTimerComplete() {
    const currentMode = document.querySelector('.controls .active').textContent;
    
    // Create celebration effect
    createConfetti();
    
    // Play completion sound
    if (soundEnabled) {
        SOUNDS.complete.volume = notificationVolume;
        SOUNDS.complete.currentTime = 0;
        SOUNDS.complete.play().catch(err => console.log('Complete sound failed:', err));
    }
    
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        const message = currentMode === 'Pomodoro' 
            ? '🎉 Pomodoro Complete!' 
            : '⏰ Break Time Over!';
        new Notification(message, {
            icon: '/favicon.ico',
            body: currentMode === 'Pomodoro' 
                ? 'Great job! Time for a break!' 
                : 'Break is over! Ready to focus?'
        });
    }

    // Flash the title
    const flashMessage = currentMode === 'Pomodoro' 
        ? '🎉 Pomodoro Complete!' 
        : '⏰ Break Time Over!';
    flashTitle(flashMessage);
    
    // Show in-page notification
    const message = currentMode === 'Pomodoro' 
        ? '🎉 Great job! You\'ve completed a Pomodoro session!' 
        : '⏰ Break time is over!';
    showNotification(message, 'success', 6000);
    
    // Handle auto-start breaks
    if (currentMode === 'Pomodoro') {
        sessionCount++;
        if (autoStartBreaks) {
            if (sessionCount % longBreakInterval === 0) {
                setTimeout(() => {
                    document.getElementById('longBreak').click();
                    startTimer();
                }, 1000);
            } else {
                setTimeout(() => {
                    document.getElementById('shortBreak').click();
                    startTimer();
                }, 1000);
            }
        }
    } else if (autoStartBreaks) {
        setTimeout(() => {
            document.getElementById('pomodoro').click();
            startTimer();
        }, 1000);
    }
}

// Update the showNotification function to accept duration
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Add these functions
function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const confettiCount = 800;

    for (let i = 0; i < confettiCount; i++) { // Increased number of bubbles
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random properties
        const color = colors[Math.floor(Math.random() * colors.length)];
        const leftOffset = (Math.random() * 100) - 50; // -50 to 50
        const size = Math.random() * 20 + 5; // 5 to 15
        const duration = Math.random() * 3 + 2; // 2 to 5 seconds
        
        confetti.style.backgroundColor = color;
        confetti.style.left = `calc(50% + ${leftOffset}vw)`;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.animationDuration = `${duration}s`;
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => confetti.remove(), duration * 9000);
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('timer-progress-bar');
    const totalTime = getCurrentModeTime();
    const percentage = (timeLeft / totalTime) * 100;
    progressBar.style.width = `${percentage}%`;
}

function getCurrentModeTime() {
    const currentMode = document.querySelector('.controls .active').textContent;
    switch(currentMode) {
        case 'Pomodoro':
            return pomodoroTime;
        case 'Short Break':
            return shortBreakTime;
        case 'Long Break':
            return longBreakTime;
        default:
            return pomodoroTime;
    }
}

function updateLapTimesList() {
    const lapList = document.getElementById('lap-times-list');
    lapList.innerHTML = '';
    
    lapTimes.forEach(lap => {
        const li = document.createElement('li');
        const minutes = Math.floor((lap.totalTime % 3600000) / 60000);
        const seconds = Math.floor((lap.totalTime % 60000) / 1000);
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        li.innerHTML = `
            <span>Lap ${lap.lapNumber}</span>
            <span>${timeString}</span>
        `;
        lapList.insertBefore(li, lapList.firstChild);
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Add these variables at the top with other variables
let clockInterval = null;

// Add this function to update the clock
function updateClock() {
    const now = new Date();
    
    // Format time
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // Format date
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();

    // Update the clock display
    const clockElement = document.getElementById('taskbar-clock');
    clockElement.innerHTML = `
        <div class="clock-time">${hours}:${minutes}:${seconds}</div>
        <div class="clock-date">${day}/${month}/${year}</div>
    `;
}

// Inside the DOMContentLoaded event listener, add this code
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

    // Initialize and start the clock
    updateClock();
    clockInterval = setInterval(updateClock, 1000);

    // Add cleanup when window unloads
    window.addEventListener('unload', () => {
        if (clockInterval) {
            clearInterval(clockInterval);
        }
    });

    // ... rest of existing code ...
});

// Add these variables at the top with other variables
let typedKeys = '';
const BUBBLE_TIMEOUT = 10000; // How long bubbles stay on screen (3 seconds)

// Add this function to create and animate bubbles
function createWindowsBubble() {
    const bubble = document.createElement('div');
    bubble.src = 'imgs/bubbles-png-12.png';
    bubble.className = 'windows-bubble';
    
    // Random size between 20px and 150px for more variety
    const size = Math.random() * 130 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // Random starting position (can start from outside the viewport)
    const startX = Math.random() * (window.innerWidth + 400) - 200; // -200 to width+200
    const startY = Math.random() * (window.innerHeight + 400) - 200; // -200 to height+200
    bubble.style.left = `${startX}px`;
    bubble.style.top = `${startY}px`;
    
    // Random movement direction and speed
    const angle = Math.random() * Math.PI * 2; // Random angle in radians
    const speed = Math.random() * 200 + 100; // Random speed between 100-300 pixels
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    
    // Random rotation
    const rotation = Math.random() * 720 - 360; // -360 to 360 degrees
    
    // Apply animation with custom properties
    bubble.style.animation = 'none'; // Reset animation
    bubble.offsetHeight; // Force reflow
    
    bubble.style.transform = `rotate(0deg) translate(0, 0)`;
    bubble.style.transition = `all ${BUBBLE_TIMEOUT}ms ease-out`;
    
    document.body.appendChild(bubble);
    
    // Start animation on next frame
    requestAnimationFrame(() => {
        bubble.style.transform = `
            rotate(${rotation}deg) 
            translate(${dx}px, ${dy}px)
        `;
        bubble.style.opacity = '0';
    });
    
    // Remove bubble after animation
    setTimeout(() => {
        bubble.remove();
    }, BUBBLE_TIMEOUT);
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

    // Add keyboard event listener for "windows" easter egg
    document.addEventListener('keydown', (e) => {
        typedKeys += e.key.toLowerCase();
        
        // Keep only the last 7 characters (length of "windows")
        if (typedKeys.length > 7) {
            typedKeys = typedKeys.slice(-7);
        }
        
        // Check if user typed "windows"
        if (typedKeys === 'windows') {
            // Create more bubbles with staggered timing
            for (let i = 0; i < 55; i++) { // Increased number of bubbles
                setTimeout(() => {
                    createWindowsBubble();
                }, Math.random() * 500); // Random delay up to 1 second
            }
            typedKeys = ''; // Reset the typed keys
        }
    });

    // ... rest of existing code ...
});
