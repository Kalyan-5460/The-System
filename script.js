document.addEventListener('DOMContentLoaded', () => {

  // Global variable to track current counts
  window.currentExerciseCounts = {
    pushups: 0,
    arms: { left: 0, right: 0, total: 0 }
  };

  
  // DOM Elements
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const overallProgress = document.getElementById('overall-progress');
  const progressNumbers = document.getElementById('progress-numbers');
  const emptyState = document.getElementById('empty-state');
  const currentDateTime = document.getElementById('currentDateTime');
  
  // Task type selection
  const typeSelect = document.getElementById('task-type-select');
  const targetContainer = document.getElementById('target-container');
  const targetValue = document.getElementById('target-value');
  const timeUnit = document.getElementById('time-unit');
  const countdownContainer = document.getElementById('countdown-container');
  const countdownHours = document.getElementById('countdown-hours');
  const countdownMinutes = document.getElementById('countdown-minutes');
  
  // Checkbox elements
  const checkboxContainer = document.getElementById('checkbox-container');
  const daily24HrCheckbox = document.getElementById('daily24HrCheckbox');
  const requiredCheckbox = document.getElementById('requiredCheckbox');
  
  // Progress modal
  const progressModal = document.getElementById('progress-modal');
  const progressInput = document.getElementById('progress-input');
  const progressUnit = document.getElementById('progress-unit');
  const progressUnitText = document.getElementById('progress-unit-text');
  const updateProgressBtn = document.getElementById('update-progress-btn');
  const cancelProgressBtn = document.getElementById('cancel-progress-btn');
  
  // Context menu
  const contextMenu = document.getElementById('contextMenu');
  const contextEdit = document.getElementById('contextEdit');
  const contextSelect = document.getElementById('contextSelect');
  
  // Edit task modal
  const editTaskModal = document.getElementById('editTaskModal');
  const editTaskInput = document.getElementById('editTaskInput');
  const editTargetContainer = document.getElementById('editTargetContainer');
  const editTargetValue = document.getElementById('editTargetValue');
  const editTimeUnit = document.getElementById('editTimeUnit');
  const editCountdownContainer = document.getElementById('editCountdownContainer');
  const editCountdownHours = document.getElementById('editCountdownHours');
  const editCountdownMinutes = document.getElementById('editCountdownMinutes');
  const editCheckboxContainer = document.getElementById('editCheckboxContainer');
  const edit24HrCheckbox = document.getElementById('edit24HrCheckbox');
  const editRequiredCheckbox = document.getElementById('editRequiredCheckbox');
  const saveEditBtn = document.getElementById('saveEditBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  
  // Selection system
  const selectionActionsBar = document.getElementById('selectionActionsBar');
  const selectedCount = document.getElementById('selectedCount');
  const markSelectedBtn = document.getElementById('markSelectedBtn');
  const unmarkSelectedBtn = document.getElementById('unmarkSelectedBtn');
  const exceptionSelectedBtn = document.getElementById('exceptionSelectedBtn');
  const unexceptionSelectedBtn = document.getElementById('unexceptionSelectedBtn');
  const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
  const selectAllTasksBtn = document.getElementById('selectAllTasksBtn');
  const cancelSelectionBtn = document.getElementById('cancelSelectionBtn');
  
  // Task Data elements
  const taskDataBtn = document.getElementById('taskDataBtn');
  const taskDataModal = document.getElementById('taskDataModal');
  const closeTaskDataBtn = document.getElementById('closeTaskDataBtn');
  const completedTasksBtn = document.getElementById('completedTasksBtn');
  const uncompletedTasksBtn = document.getElementById('uncompletedTasksBtn');
  
  // Completed Tasks Modal
  const completedTasksModal = document.getElementById('completedTasksModal');
  const closeCompletedTasksBtn = document.getElementById('closeCompletedTasksBtn');
  const completedTasksTable = document.getElementById('completedTasksTable');
  const completedTasksTableBody = document.getElementById('completedTasksTableBody');
  const completedTasksActions = document.getElementById('completedTasksActions');
  const addAllCompletedBtn = document.getElementById('addAllCompletedBtn');
  const removeAllCompletedBtn = document.getElementById('removeAllCompletedBtn');
  const addRemoveAllCompletedBtn = document.getElementById('addRemoveAllCompletedBtn');
  const selectAllCompletedBtn = document.getElementById('selectAllCompletedBtn');
  const cancelCompletedSelectionBtn = document.getElementById('cancelCompletedSelectionBtn');
  
  // Uncompleted Tasks Modal
  const uncompletedTasksModal = document.getElementById('uncompletedTasksModal');
  const closeUncompletedTasksBtn = document.getElementById('closeUncompletedTasksBtn');
  const uncompletedTasksTable = document.getElementById('uncompletedTasksTable');
  const uncompletedTasksTableBody = document.getElementById('uncompletedTasksTableBody');
  const uncompletedTasksActions = document.getElementById('uncompletedTasksActions');
  const addAllUncompletedBtn = document.getElementById('addAllUncompletedBtn');
  const removeAllUncompletedBtn = document.getElementById('removeAllUncompletedBtn');
  const addRemoveAllUncompletedBtn = document.getElementById('addRemoveAllUncompletedBtn');
  const selectAllUncompletedBtn = document.getElementById('selectAllUncompletedBtn');
  const cancelUncompletedSelectionBtn = document.getElementById('cancelUncompletedSelectionBtn');
  
  // State
  let tasks = [];
  let completedTasksArchive = [];
  let uncompletedTasksArchive = [];
  let currentTaskType = 'regular';
  let editingTaskId = null;
  let currentContextTaskId = null;
  let countdownIntervals = new Map();
  let dailyTimers = new Map(); // For 24-hour timers
  let isSelectionMode = false;
  let selectedTasks = new Set();
  let exceptionTimestamps = new Map(); // Store exception timestamps
  let pausedTimerData = new Map(); // Store paused timer data for proper resumption
  let completedTasksSelectionMode = false;
  let uncompletedTasksSelectionMode = false;
  let selectedCompletedTasks = new Set();
  let selectedUncompletedTasks = new Set();

  // Camera State Variables
  const cameraModal = document.getElementById('cameraModal');
  const cameraFeed = document.getElementById('cameraFeed');
  const poseCanvas = document.getElementById('poseCanvas');
  const startDetectionBtn = document.getElementById('startDetection');
  const stopDetectionBtn = document.getElementById('stopDetection');
  const saveCameraResultsBtn = document.getElementById('saveCameraResults');
  const closeCameraBtn = document.getElementById('closeCameraBtn');
  const detectionStatusDisplay = document.getElementById('detectionStatus');

  let currentCameraTaskId = null;
  let isDetectionRunning = false;
  let currentExerciseType = null;
  let cameraCount = 0; // This will now hold the FINAL count after stopping.

  // Initialize
  loadTasks();
  loadTaskArchives();
  loadPausedTimerData(); // Load paused timer data from localStorage
  updateUI();
  startCountdownTimers();
  startDailyTimers();
  updateCurrentDateTime();

  // Set default task type to regular and initialize UI
  typeSelect.value = 'regular';
  handleTypeSelection('regular');

  // Update current date and time every second
  setInterval(updateCurrentDateTime, 1000);

  // Event Listeners
  taskForm.addEventListener('submit', handleAddTask);
  
  typeSelect.addEventListener('change', () => {
    handleTypeSelection(typeSelect.value);
  });
  
  updateProgressBtn.addEventListener('click', handleUpdateProgress);
  cancelProgressBtn.addEventListener('click', hideProgressModal);
  
  // Camera Modal Events
  closeCameraBtn.addEventListener('click', closeCameraModal);
  startDetectionBtn.addEventListener('click', startPoseDetection);
  stopDetectionBtn.addEventListener('click', stopPoseDetection);
  saveCameraResultsBtn.addEventListener('click', saveCameraResults);

  cameraModal.addEventListener('click', (e) => {
      if (e.target === cameraModal) {
          closeCameraModal();
      }
  });

  
  // Context menu events
  contextEdit.addEventListener('click', () => {
    if (currentContextTaskId) {
      showEditTaskModal(currentContextTaskId);
      hideContextMenu();
    }
  });
  
  contextSelect.addEventListener('click', () => {
    if (currentContextTaskId) {
      enterSelectionMode();
      toggleTaskSelection(currentContextTaskId);
      hideContextMenu();
    }
  });
  
  // Edit task modal events
  saveEditBtn.addEventListener('click', handleSaveEdit);
  cancelEditBtn.addEventListener('click', hideEditTaskModal);
  
  // Selection actions
  markSelectedBtn.addEventListener('click', () => markSelectedTasks(true));
  unmarkSelectedBtn.addEventListener('click', () => markSelectedTasks(false));
  exceptionSelectedBtn.addEventListener('click', () => exceptionSelectedTasks(true));
  unexceptionSelectedBtn.addEventListener('click', () => exceptionSelectedTasks(false));
  deleteSelectedBtn.addEventListener('click', deleteSelectedTasks);
  selectAllTasksBtn.addEventListener('click', toggleSelectAllTasks);
  cancelSelectionBtn.addEventListener('click', exitSelectionMode);
  
  // Task Data Modal Events
  taskDataBtn.addEventListener('click', () => {
    document.getElementById('secretDungeonModal').style.display = 'none';
    taskDataModal.style.display = 'flex';
  });
  
  closeTaskDataBtn.addEventListener('click', () => {
    taskDataModal.style.display = 'none';
  });
  
  completedTasksBtn.addEventListener('click', () => {
    taskDataModal.style.display = 'none';
    showCompletedTasksModal();
  });
  
  uncompletedTasksBtn.addEventListener('click', () => {
    taskDataModal.style.display = 'none';
    showUncompletedTasksModal();
  });
  
  // Completed Tasks Modal Events
  closeCompletedTasksBtn.addEventListener('click', () => {
    completedTasksModal.style.display = 'none';
    exitCompletedTasksSelectionMode();
  });
  
  addAllCompletedBtn.addEventListener('click', addAllSelectedCompletedTasks);
  removeAllCompletedBtn.addEventListener('click', removeAllSelectedCompletedTasks);
  addRemoveAllCompletedBtn.addEventListener('click', addAndRemoveAllSelectedCompletedTasks);
  selectAllCompletedBtn.addEventListener('click', toggleSelectAllCompletedTasks);
  cancelCompletedSelectionBtn.addEventListener('click', exitCompletedTasksSelectionMode);
  
  // Uncompleted Tasks Modal Events
  closeUncompletedTasksBtn.addEventListener('click', () => {
    uncompletedTasksModal.style.display = 'none';
    exitUncompletedTasksSelectionMode();
  });
  
  addAllUncompletedBtn.addEventListener('click', addAllSelectedUncompletedTasks);
  removeAllUncompletedBtn.addEventListener('click', removeAllSelectedUncompletedTasks);
  addRemoveAllUncompletedBtn.addEventListener('click', addAndRemoveAllSelectedUncompletedTasks);
  selectAllUncompletedBtn.addEventListener('click', toggleSelectAllUncompletedTasks);
  cancelUncompletedSelectionBtn.addEventListener('click', exitUncompletedTasksSelectionMode);
  
  // Close modals when clicking outside
  progressModal.addEventListener('click', (e) => {
    if (e.target === progressModal) {
      hideProgressModal();
    }
  });
  
  editTaskModal.addEventListener('click', (e) => {
    if (e.target === editTaskModal) {
      hideEditTaskModal();
    }
  });
  
  taskDataModal.addEventListener('click', (e) => {
    if (e.target === taskDataModal) {
      taskDataModal.style.display = 'none';
    }
  });
  
  completedTasksModal.addEventListener('click', (e) => {
    if (e.target === completedTasksModal) {
      completedTasksModal.style.display = 'none';
      exitCompletedTasksSelectionMode();
    }
  });
  
  uncompletedTasksModal.addEventListener('click', (e) => {
    if (e.target === uncompletedTasksModal) {
      uncompletedTasksModal.style.display = 'none';
      exitUncompletedTasksSelectionMode();
    }
  });
  
  document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) {
      hideContextMenu();
    }
  });

  // Functions
  function updateCurrentDateTime() {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    currentDateTime.textContent = `📅 ${now.toLocaleDateString('en-US', options)}`;
  }

  // Save paused timer data to localStorage
  function savePausedTimerData() {
    const pausedData = {};
    pausedTimerData.forEach((value, key) => {
      pausedData[key] = value;
    });
    localStorage.setItem('pausedTimerData', JSON.stringify(pausedData));
  }

  // Load paused timer data from localStorage
  function loadPausedTimerData() {
    const saved = localStorage.getItem('pausedTimerData');
    if (saved) {
      try {
        const pausedData = JSON.parse(saved);
        pausedTimerData.clear();
        Object.entries(pausedData).forEach(([key, value]) => {
          pausedTimerData.set(key, value);
        });
      } catch (e) {
        console.error('Error loading paused timer data:', e);
      }
    }
  }

  // Save exception timestamps to localStorage
  function saveExceptionTimestamps() {
    const exceptionData = {};
    exceptionTimestamps.forEach((value, key) => {
      exceptionData[key] = value;
    });
    localStorage.setItem('exceptionTimestamps', JSON.stringify(exceptionData));
  }

  // Load exception timestamps from localStorage
  function loadExceptionTimestamps() {
    const saved = localStorage.getItem('exceptionTimestamps');
    if (saved) {
      try {
        const exceptionData = JSON.parse(saved);
        exceptionTimestamps.clear();
        Object.entries(exceptionData).forEach(([key, value]) => {
          exceptionTimestamps.set(key, value);
        });
      } catch (e) {
        console.error('Error loading exception timestamps:', e);
      }
    }
  }

  // Task Archive Functions
  function saveTaskArchives() {
    localStorage.setItem('completedTasksArchive', JSON.stringify(completedTasksArchive));
    localStorage.setItem('uncompletedTasksArchive', JSON.stringify(uncompletedTasksArchive));
  }

  function loadTaskArchives() {
    const completedSaved = localStorage.getItem('completedTasksArchive');
    const uncompletedSaved = localStorage.getItem('uncompletedTasksArchive');
    
    if (completedSaved) {
      try {
        completedTasksArchive = JSON.parse(completedSaved);
      } catch (e) {
        console.error('Error loading completed tasks archive:', e);
        completedTasksArchive = [];
      }
    }
    
    if (uncompletedSaved) {
      try {
        uncompletedTasksArchive = JSON.parse(uncompletedSaved);
      } catch (e) {
        console.error('Error loading uncompleted tasks archive:', e);
        uncompletedTasksArchive = [];
      }
    }
  }

  function addToCompletedArchive(task) {
    const archiveTask = {
      ...task,
      completedAt: Date.now(),
      archivedAt: Date.now()
    };
    completedTasksArchive.push(archiveTask);
    saveTaskArchives();
  }

  function addToUncompletedArchive(task, reason = 'timeout') {
    const archiveTask = {
      ...task,
      uncompletedAt: Date.now(),
      uncompletedReason: reason,
      archivedAt: Date.now()
    };
    uncompletedTasksArchive.push(archiveTask);
    saveTaskArchives();
  }

  function handleAddTask(e) {
    e.preventDefault();
    
    const text = taskInput.value.trim();
    if (!text) return;
    
    // Check for secret codes
    if (text.toLowerCase() === 'shadowmonarch') {
      const isVisible = document.getElementById('secretDaggerIcon').style.display === 'flex';
      document.getElementById('secretDaggerIcon').style.display = isVisible ? 'none' : 'flex';
      saveSecretState(!isVisible);
      taskInput.value = '';
      return;
    }
    
    if (text.toLowerCase() === 'resetallshadowmonarch') {
      if (confirm('Are you sure you want to reset all progress? This action cannot be undone!')) {
        resetAllProgress();
      }
      taskInput.value = '';
      return;
    }
    
    let targetVal = null;
    let unit = null;
    let countdownTime = null;
    
    if (currentTaskType === 'time') {
      const target = parseInt(targetValue.value);
      if (!target || target <= 0) {
        alert('Please enter a valid time target');
        return;
      }
      targetVal = timeUnit.value === 'hours' ? target * 60 : target;
      unit = 'minutes';
    } else if (currentTaskType === 'count') {
      targetVal = parseInt(targetValue.value);
      if (!targetVal || targetVal <= 0) {
        alert('Please enter a valid count target');
        return;
      }
      unit = 'count';
    } else if (currentTaskType === 'countdown') {
      const hours = parseInt(countdownHours.value) || 0;
      const minutes = parseInt(countdownMinutes.value) || 0;
      
      if (hours === 0 && minutes === 0) {
        alert('Please enter a valid countdown time');
        return;
      }
      
      countdownTime = (hours * 60 + minutes) * 60 * 1000; // Convert to milliseconds
      unit = 'countdown';
    }
    
    const newTask = {
      id: Date.now().toString(),
      text: text,
      type: currentTaskType,
      completed: false,
      targetValue: targetVal,
      currentValue: currentTaskType === 'regular' ? null : 0,
      unit: unit,
      countdownTime: countdownTime,
      countdownStartTime: currentTaskType === 'countdown' ? Date.now() : null,
      dailyStartTime: (currentTaskType !== 'countdown' && daily24HrCheckbox.checked) ? Date.now() : null,
      isException: false,
      createdAt: Date.now(),
      has24Hr: daily24HrCheckbox.checked,
      isRequired: requiredCheckbox.checked
    };
    
    tasks.push(newTask);
    saveTasks();
    updateUI();
    
    // Start countdown timer if it's a countdown task
    if (currentTaskType === 'countdown') {
      startCountdownTimer(newTask.id);
    } else if (daily24HrCheckbox.checked) {
      // Start 24-hour timer for regular, time, count tasks only if 24HR is checked
      startDailyTimer(newTask.id);
    }
    
    // Reset form and task type to regular
    taskInput.value = '';
    targetValue.value = '';
    countdownHours.value = '';
    countdownMinutes.value = '';
    typeSelect.value = 'regular';
    handleTypeSelection('regular');
  }

  function resetAllProgress() {
    // Clear all tasks
    tasks = [];
    saveTasks();
    
    // Clear archives
    completedTasksArchive = [];
    uncompletedTasksArchive = [];
    saveTaskArchives();
    
    // Reset profile if available
    if (window.profileManager) {
      window.profileManager.resetProfile();
    }
    
    // Clear all intervals
    countdownIntervals.forEach(interval => clearInterval(interval));
    countdownIntervals.clear();
    dailyTimers.forEach(interval => clearInterval(interval));
    dailyTimers.clear();
    
    // Clear exception timestamps and paused timer data
    exceptionTimestamps.clear();
    pausedTimerData.clear();
    
    // Clear from localStorage
    localStorage.removeItem('pausedTimerData');
    localStorage.removeItem('exceptionTimestamps');
    
    // Clear secret state
    document.getElementById('secretDaggerIcon').style.display = 'none';
    saveSecretState(false);
    
    // Clear notes
    localStorage.removeItem('shadowNotes');
    document.getElementById('notesTextarea').value = '';
    
    // Exit selection mode if active
    exitSelectionMode();
    
    // Update UI
    updateUI();
    
    alert('All progress has been reset!');
  }

  function handleTypeSelection(type) {
    currentTaskType = type;
    
    // Show/hide input containers
    if (type === 'regular') {
      targetContainer.style.display = 'none';
      countdownContainer.style.display = 'none';
      checkboxContainer.style.display = 'block';
    } else if (type === 'countdown') {
      targetContainer.style.display = 'none';
      countdownContainer.style.display = 'block';
      checkboxContainer.style.display = 'block';
    } else {
      targetContainer.style.display = 'block';
      countdownContainer.style.display = 'none';
      timeUnit.style.display = type === 'time' ? 'block' : 'none';
      targetValue.placeholder = type === 'time' ? 'Duration' : 'Count';
      checkboxContainer.style.display = 'block';
    }
  }

  function startCountdownTimers() {
    tasks.forEach(task => {
      if (task.type === 'countdown' && !task.completed && !task.isException) {
        startCountdownTimer(task.id);
      }
    });
  }

  function startDailyTimers() {
    tasks.forEach(task => {
      if (task.type !== 'countdown' && !task.completed && !task.isException && task.dailyStartTime && task.has24Hr) {
        startDailyTimer(task.id);
      }
    });
  }

  function startCountdownTimer(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.type !== 'countdown' || task.completed || task.isException) return;
    
    // Clear existing interval if any
    if (countdownIntervals.has(taskId)) {
      clearInterval(countdownIntervals.get(taskId));
    }
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - task.countdownStartTime;
      const remaining = task.countdownTime - elapsed;
      
      if (remaining <= 0) {
        // Time's up - apply penalty and delete task
        clearInterval(interval);
        countdownIntervals.delete(taskId);
        
        // Add to uncompleted archive
        addToUncompletedArchive(task, 'countdown_expired');
        
        // Apply penalty only if task is required
        if (task.isRequired) {
          applyPenalty();
        }
        
        deleteTask(taskId);
      } else {
        // Update UI
        updateUI();
      }
    }, 1000);
    
    countdownIntervals.set(taskId, interval);
  }

  function startDailyTimer(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.type === 'countdown' || task.completed || task.isException || !task.dailyStartTime || !task.has24Hr) return;
    
    // Clear existing interval if any
    if (dailyTimers.has(taskId)) {
      clearInterval(dailyTimers.get(taskId));
    }
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - task.dailyStartTime;
      const dailyLimit = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (elapsed >= dailyLimit) {
        // 24 hours passed - apply penalty and delete task
        clearInterval(interval);
        dailyTimers.delete(taskId);
        
        // Add to uncompleted archive
        addToUncompletedArchive(task, '24hr_expired');
        
        // Apply penalty only if task is required
        if (task.isRequired) {
          applyPenalty();
        }
        
        deleteTask(taskId);
      } else {
        // Update UI to show remaining time
        updateUI();
      }
    }, 1000);
    
    dailyTimers.set(taskId, interval);
  }

  function applyPenalty() {
    if (window.profileManager) {
      // Reduce level
      if (window.profileManager.profile.level > 0) {
        window.profileManager.levelDown();
      }
      
      // Reduce available points or stats
      if (window.profileManager.profile.availablePoints > 0) {
        window.profileManager.profile.availablePoints--;
      } else {
        // Reduce a random stat
        window.profileManager.reduceStatPoint();
      }
      
      window.profileManager.saveProfile();
      window.profileManager.updateProfileDisplay();
      
      // Queue penalty effect
      window.profileManager.queueEffect('penalty');
    }
  }

  function formatTaskDateTime(timestamp) {
    const date = new Date(timestamp);
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-GB', options).replace(',', '');
  }

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''} ${getTaskProgressClass(task)} ${task.isException ? 'exception' : ''}`;
    li.dataset.taskId = task.id;
    
    let exerciseType = '';
    let cameraButtonClass = 'camera-btn-small';
    if (task.text.toLowerCase().includes('shadowpushups')) {
        exerciseType = 'pushups';
        cameraButtonClass += ' pushups';
        li.dataset.exercise = 'pushups';
    } else if (task.text.toLowerCase().includes('shadowarms')) {
        exerciseType = 'arms';
        cameraButtonClass += ' arms';
        li.dataset.exercise = 'arms';
    }
    
    if (isSelectionMode) {
        li.classList.add('selection-mode');
        if (selectedTasks.has(task.id)) {
            li.classList.add('selected');
        }
    }
    
    const progressPercentage = getProgressPercentage(task);
    const taskDisplay = getTaskDisplayText(task);
    
    const isProgressDisabled = task.isException && (task.type === 'time' || task.type === 'count');
    
     const isExerciseTask = (task.type === 'count') && 
                          (task.text.toLowerCase().includes('shadowpushups') || 
                           task.text.toLowerCase().includes('shadowarms'));
    
    const cameraButton = isExerciseTask ? `
        <button class="${cameraButtonClass}" title="Camera Check - ${exerciseType === 'pushups' ? 'Floor Pushups' : 'Arm Pushups'}">
            <i class="fa-solid fa-camera"></i>
        </button>
    ` : '';
    
    li.innerHTML = `
      <div class="task-header">
        <div class="task-content">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} ${task.isException ? 'disabled' : ''}>
          <span class="task-text" title="${task.text}">${taskDisplay}</span>
          <span class="task-type-badge badge-${task.type}">${task.type}</span>
          ${task.isException ? '<span class="exception-badge">⏸️ PAUSED</span>' : ''}
          ${!task.isRequired ? '<span class="optional-badge">📋 OPTIONAL</span>' : ''}
          ${isExerciseTask ? `<span class="exercise-badge">${exerciseType === 'pushups' ? '🏋️' : '💪'}</span>` : ''}
        </div>
      </div>
      <div class="task-buttons">
          <button class="task-btn edit-btn" title="Edit Task">
            <i class="fa-solid fa-edit"></i>
          </button>
          ${task.type !== 'regular' && task.type !== 'countdown' && !task.completed ? 
            `<button class="task-btn progress-btn" title="Update Progress" ${isProgressDisabled ? 'disabled' : ''}>
              <i class="fa-solid fa-chart-line"></i>
            </button>` : ''
          }
          ${cameraButton}
          <button class="task-btn delete-btn" title="Delete Task">
            <i class="fa-solid fa-trash"></i>
          </button>
      </div>
      ${task.type !== 'regular' ? `
        <div class="task-progress">
          <div class="progress-bar">
            <div class="progress-fill ${task.type === 'countdown' ? 'countdown-fill' : ''}" style="width: ${progressPercentage}%"></div>
          </div>
          <div class="progress-text">
            <span>${progressPercentage.toFixed(0)}% ${task.type === 'countdown' ? 'remaining' : 'complete'}</span>
            <span class="${task.type === 'countdown' ? 'countdown-timer' : ''} ${task.type === 'countdown' && progressPercentage < 25 && !task.isException ? 'countdown-danger-text' : ''}">${getProgressText(task)}</span>
          </div>
        </div>
      ` : ''}
      ${task.type !== 'countdown' && task.dailyStartTime && !task.isException && task.has24Hr ? `
        <div class="daily-timer">
          <span class="daily-timer-text">${getDailyTimerText(task)}</span>
        </div>
      ` : ''}
      <div class="task-datetime">
        <span class="task-created-time">📅 Created: ${formatTaskDateTime(task.createdAt)}</span>
      </div>
    `;
    
    
    const checkbox = li.querySelector('.task-checkbox');
    const editBtn = li.querySelector('.edit-btn');
    const progressBtn = li.querySelector('.progress-btn');
    const deleteBtn = li.querySelector('.delete-btn');
    
    if (isSelectionMode) {
      li.addEventListener('click', (e) => {
        if (e.target.closest('button, input[type="checkbox"]')) {
          return;
        }
        e.preventDefault();
        toggleTaskSelection(task.id);
      });
    }
    
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!task.isException && !isSelectionMode) {
        toggleTask(task.id);
      }
    });

    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isSelectionMode) {
        showEditTaskModal(task.id);
      }
    });

    if (progressBtn) {
      progressBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!task.isException && !isSelectionMode) {
          showProgressModal(task.id);
        }
      });
    }

    if (isExerciseTask) {
        const cameraBtn = li.querySelector('.camera-btn-small');
        cameraBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isSelectionMode) {
                openCameraModal(task.id, task.text);
            }
        });
    }

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isSelectionMode) {
        deleteTask(task.id);
      }
    });
    
    if (!isSelectionMode) {
        li.addEventListener('click', (e) => {
            if (e.target.closest('button, input[type="checkbox"]')) {
                return;
            }
            
            const taskId = li.dataset.taskId;
            const now = new Date().getTime();
            const lastTap = parseInt(li.dataset.lastTap || 0);
            const tapCount = parseInt(li.dataset.tapCount || 0);
            const tripleTapThreshold = 500;

            if ((now - lastTap) < tripleTapThreshold) {
                const newTapCount = tapCount + 1;
                li.dataset.tapCount = newTapCount;
                if (newTapCount === 3) {
                    li.dataset.tapCount = 0;
                    li.dataset.lastTap = 0;
                    enterSelectionMode();
                    toggleTaskSelection(taskId);
                }
            } else {
                li.dataset.tapCount = 1;
            }
            li.dataset.lastTap = now;
        });
    }
    
    return li;
}

async function openCameraModal(taskId, taskText) {
    currentCameraTaskId = taskId;
    
    if (taskText.toLowerCase().includes('shadowpushups')) {
        currentExerciseType = 'pushups';
    } else if (taskText.toLowerCase().includes('shadowarms')) {
        currentExerciseType = 'arms';
    } else {
        alert('This task type does not support camera detection.');
        return;
    }
    
    cameraModal.style.display = 'flex';
    resetCameraUI();
    
    try {
        await initializeCamera();
    } catch (error) {
        console.error("Error initializing camera:", error);
        detectionStatusDisplay.textContent = 'Camera Error - Please Refresh';
        detectionStatusDisplay.style.color = '#dc3545';
        startDetectionBtn.disabled = true;
    }
}

async function initializeCamera() {
    const success = await window.cameraManager.initialize();
    if (success) {
        detectionStatusDisplay.textContent = 'Camera Ready - Start Detection';
        detectionStatusDisplay.style.color = '#28a745';
        startDetectionBtn.disabled = false;
    } else {
        detectionStatusDisplay.textContent = 'Camera Error - Please Refresh';
        detectionStatusDisplay.style.color = '#dc3545';
        startDetectionBtn.disabled = true;
    }
}


function closeCameraModal() {
    if (isDetectionRunning) {
        stopPoseDetection();
    }
    window.cameraManager.stop();
    cameraModal.style.display = 'none';
    currentCameraTaskId = null;
    currentExerciseType = null;
    cameraCount = 0;
}

async function startPoseDetection() {
    if (!currentExerciseType) return;
    isDetectionRunning = true;
    startDetectionBtn.disabled = true;
    stopDetectionBtn.disabled = false;
    saveCameraResultsBtn.disabled = true;
    detectionStatusDisplay.textContent = 'Starting Detection...';
    detectionStatusDisplay.style.color = '#ffd700';

    try {
        await window.poseDetector.startDetection(currentExerciseType);
        detectionStatusDisplay.textContent = `${currentExerciseType === 'pushups' ? 'Push-up' : 'Arm Exercise'} Detection Active`;
        detectionStatusDisplay.style.color = '#00ff00';
    } catch (error) {
        console.error('Detection start failed:', error);
        detectionStatusDisplay.textContent = 'Detection Error - Please Refresh';
        detectionStatusDisplay.style.color = '#dc3545';
        isDetectionRunning = false;
        startDetectionBtn.disabled = false;
        stopDetectionBtn.disabled = true;
    }
}

function stopPoseDetection() {
    if (!isDetectionRunning) return;

    isDetectionRunning = false;
    startDetectionBtn.disabled = false;
    stopDetectionBtn.disabled = true;
    saveCameraResultsBtn.disabled = false;
    detectionStatusDisplay.textContent = 'Detection Stopped - Ready to Save';
    detectionStatusDisplay.style.color = '#3399ff';
    
    const counts = window.poseDetector.stopDetection();
    cameraCount = counts.total; 
    console.log(`Detection stopped. Final count captured: ${cameraCount}`);
}

function saveCameraResults() {
    if (!currentCameraTaskId) {
        alert('❌ No task selected for saving!');
        return;
    }
    const task = tasks.find(t => t.id === currentCameraTaskId);
    if (!task) {
        alert('❌ Task not found!');
        return;
    }

    if (cameraCount === 0) {
        alert('💪 No new exercises were detected! Perform some exercises before saving.');
        return;
    }

    const countToAdd = cameraCount;
    const oldValue = task.currentValue || 0;
    task.currentValue = oldValue + countToAdd;

    if (task.currentValue >= task.targetValue) {
        task.currentValue = task.targetValue;
        task.completed = true;
        addToCompletedArchive(task);
    }

    if (task.completed) {
        detectionStatusDisplay.textContent = `🎉 TASK COMPLETED! Added ${countToAdd} reps.`;
        detectionStatusDisplay.style.color = '#00ff00';
        if (window.confetti) {
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        }
    } else {
        detectionStatusDisplay.textContent = `✅ Added ${countToAdd} reps! Total: ${task.currentValue}/${task.targetValue}`;
        detectionStatusDisplay.style.color = '#28a745';
    }

    saveTasks();
    updateUI();
    cameraCount = 0;
    saveCameraResultsBtn.disabled = true;

    setTimeout(() => {
        closeCameraModal();
    }, 2000);
}

function resetCameraUI() {
    cameraCount = 0;
    detectionStatusDisplay.textContent = 'Initializing Camera...';
    detectionStatusDisplay.style.color = '#3399ff';
    startDetectionBtn.disabled = true;
    stopDetectionBtn.disabled = true;
    saveCameraResultsBtn.disabled = true;
    const canvas = document.getElementById('poseCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
  
  function getDailyTimerText(task) {
    if (task.isException || !task.has24Hr) return '';
    
    const elapsed = Date.now() - task.dailyStartTime;
    const dailyLimit = 24 * 60 * 60 * 1000; // 24 hours
    const remaining = Math.max(0, dailyLimit - elapsed);
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `⏰ ${hours}h ${minutes}m remaining`;
  }

  function showContextMenu(taskId, element) {
    currentContextTaskId = taskId;
    
    const rect = element.getBoundingClientRect();
    contextMenu.style.left = `${rect.left + 10}px`;
    contextMenu.style.top = `${rect.top + rect.height + 5}px`;
    contextMenu.style.display = 'block';
    
    const menuRect = contextMenu.getBoundingClientRect();
    if (menuRect.right > window.innerWidth) {
      contextMenu.style.left = `${window.innerWidth - menuRect.width - 10}px`;
    }
    if (menuRect.bottom > window.innerHeight) {
      contextMenu.style.top = `${rect.top - menuRect.height - 5}px`;
    }
  }

  function hideContextMenu() {
    contextMenu.style.display = 'none';
    currentContextTaskId = null;
  }

  function showEditTaskModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    editingTaskId = taskId;
    editTaskInput.value = task.text;
    
    edit24HrCheckbox.checked = task.has24Hr !== undefined ? task.has24Hr : true;
    editRequiredCheckbox.checked = task.isRequired !== undefined ? task.isRequired : true;
    
    if (task.type === 'time' || task.type === 'count') {
      editTargetContainer.style.display = 'block';
      editCountdownContainer.style.display = 'none';
      editTargetValue.value = task.type === 'time' ? 
        (task.unit === 'minutes' ? task.targetValue : Math.floor(task.targetValue / 60)) : 
        task.targetValue;
      
      if (task.type === 'time') {
        editTimeUnit.style.display = 'block';
        editTimeUnit.value = task.targetValue >= 60 ? 'hours' : 'minutes';
      } else {
        editTimeUnit.style.display = 'none';
      }
    } else if (task.type === 'countdown') {
      editTargetContainer.style.display = 'none';
      editCountdownContainer.style.display = 'block';
      
      let totalMinutes;
      if (task.isException && pausedTimerData.has(task.id)) {
        const pausedData = pausedTimerData.get(task.id);
        totalMinutes = Math.floor(pausedData.remainingTime / (60 * 1000));
      } else {
        totalMinutes = Math.floor(task.countdownTime / (60 * 1000));
      }
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      editCountdownHours.value = hours;
      editCountdownMinutes.value = minutes;
    } else {
      editTargetContainer.style.display = 'none';
      editCountdownContainer.style.display = 'none';
    }
    
    editCheckboxContainer.style.display = 'block';
    
    editTaskModal.style.display = 'flex';
    editTaskInput.focus();
  }

  function hideEditTaskModal() {
    editTaskModal.style.display = 'none';
    editingTaskId = null;
    editTaskInput.value = '';
    editTargetValue.value = '';
    editCountdownHours.value = '';
    editCountdownMinutes.value = '';
    editTargetContainer.style.display = 'none';
    editCountdownContainer.style.display = 'none';
    editCheckboxContainer.style.display = 'none';
  }

  function handleSaveEdit() {
    if (!editingTaskId) return;
    
    const task = tasks.find(t => t.id === editingTaskId);
    if (!task) return;
    
    const newText = editTaskInput.value.trim();
    if (!newText) {
      alert('Task name cannot be empty');
      return;
    }
    
    task.text = newText;
    
    const oldHas24Hr = task.has24Hr;
    task.has24Hr = edit24HrCheckbox.checked;
    task.isRequired = editRequiredCheckbox.checked;
    
    if (task.type !== 'countdown') {
      if (!oldHas24Hr && task.has24Hr && !task.completed && !task.isException) {
        task.dailyStartTime = Date.now();
        startDailyTimer(task.id);
      } else if (oldHas24Hr && !task.has24Hr) {
        if (dailyTimers.has(task.id)) {
          clearInterval(dailyTimers.get(task.id));
          dailyTimers.delete(task.id);
        }
        task.dailyStartTime = null;
      }
    }
    
    if (task.type === 'time' || task.type === 'count') {
      const newTarget = parseInt(editTargetValue.value);
      if (newTarget && newTarget > 0) {
        if (task.type === 'time') {
          task.targetValue = editTimeUnit.value === 'hours' ? newTarget * 60 : newTarget;
        } else {
          task.targetValue = newTarget;
        }
      }
    } else if (task.type === 'countdown') {
      const hours = parseInt(editCountdownHours.value) || 0;
      const minutes = parseInt(editCountdownMinutes.value) || 0;
      
      if (hours > 0 || minutes > 0) {
        const newCountdownTime = (hours * 60 + minutes) * 60 * 1000;
        
        if (task.isException) {
          pausedTimerData.set(task.id, {
            type: 'countdown',
            remainingTime: newCountdownTime
          });
          savePausedTimerData();
        } else {
          task.countdownTime = newCountdownTime;
          task.countdownStartTime = Date.now();
          
          if (countdownIntervals.has(task.id)) {
            clearInterval(countdownIntervals.get(task.id));
            countdownIntervals.delete(task.id);
          }
          
          if (!task.completed) {
            startCountdownTimer(task.id);
          }
        }
      }
    }
    
    saveTasks();
    updateUI();
    hideEditTaskModal();
  }

  function enterSelectionMode() {
    isSelectionMode = true;
    selectedTasks.clear();
    selectionActionsBar.style.display = 'flex';
    updateSelectionCount();
    updateUI();
  }

  function exitSelectionMode() {
    isSelectionMode = false;
    selectedTasks.clear();
    selectionActionsBar.style.display = 'none';
    updateUI();
  }

  function toggleTaskSelection(taskId) {
    if (selectedTasks.has(taskId)) {
      selectedTasks.delete(taskId);
    } else {
      selectedTasks.add(taskId);
    }
    updateSelectionCount();
    updateUI();
  }

  function toggleSelectAllTasks() {
    const nonExceptionTasks = tasks.filter(task => !task.isException);
    
    if (selectedTasks.size === nonExceptionTasks.length) {
      selectedTasks.clear();
    } else {
      selectedTasks.clear();
      nonExceptionTasks.forEach(task => {
        selectedTasks.add(task.id);
      });
    }
    
    updateSelectionCount();
    updateUI();
  }

  function updateSelectionCount() {
    selectedCount.textContent = selectedTasks.size;
  }

  function markSelectedTasks(completed) {
    selectedTasks.forEach(taskId => {
      const task = tasks.find(t => t.id === taskId);
      if (task && !task.isException) {
        task.completed = completed;
        
        if (completed) {
          addToCompletedArchive(task);
          
          if (task.type !== 'regular') {
            if (task.type === 'countdown') {
              if (countdownIntervals.has(taskId)) {
                clearInterval(countdownIntervals.get(taskId));
                countdownIntervals.delete(taskId);
              }
              if (window.profileManager) {
                window.profileManager.addCountdownBonus();
              }
            } else {
              task.currentValue = task.targetValue;
              if (dailyTimers.has(taskId)) {
                clearInterval(dailyTimers.get(taskId));
                dailyTimers.delete(taskId);
              }
            }
          }
        }
      }
    });
    
    saveTasks();
    updateUI();
    
    if (completed && selectedTasks.size > 0 && window.confetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    exitSelectionMode();
  }

  function exceptionSelectedTasks(isException) {
    selectedTasks.forEach(taskId => {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.isException = isException;
        
        if (isException) {
          const exceptionTime = Date.now();
          exceptionTimestamps.set(taskId, exceptionTime);
          
          if (task.type === 'countdown') {
            const elapsed = exceptionTime - task.countdownStartTime;
            const remaining = Math.max(0, task.countdownTime - elapsed);
            pausedTimerData.set(taskId, {
              type: 'countdown',
              remainingTime: remaining,
              pausedAt: exceptionTime
            });
          } else if (task.dailyStartTime && task.has24Hr) {
            const elapsed = exceptionTime - task.dailyStartTime;
            pausedTimerData.set(taskId, {
              type: 'daily',
              elapsedTime: elapsed,
              pausedAt: exceptionTime
            });
          }
          
          if (countdownIntervals.has(taskId)) {
            clearInterval(countdownIntervals.get(taskId));
            countdownIntervals.delete(taskId);
          }
          if (dailyTimers.has(taskId)) {
            clearInterval(dailyTimers.get(taskId));
            dailyTimers.delete(taskId);
          }
        } else {
          const pausedData = pausedTimerData.get(taskId);
          
          if (pausedData) {
            if (pausedData.type === 'countdown') {
              task.countdownStartTime = Date.now();
              task.countdownTime = pausedData.remainingTime;
            } else if (pausedData.type === 'daily') {
              task.dailyStartTime = Date.now() - pausedData.elapsedTime;
            }
            
            pausedTimerData.delete(taskId);
          }
          
          exceptionTimestamps.delete(taskId);
          
          if (task.type === 'countdown' && !task.completed) {
            startCountdownTimer(taskId);
          } else if (task.type !== 'countdown' && !task.completed && task.has24Hr) {
            startDailyTimer(taskId);
          }
        }
      }
    });
    
    savePausedTimerData();
    saveExceptionTimestamps();
    saveTasks();
    updateUI();
    exitSelectionMode();
  }

  function deleteSelectedTasks() {
    if (!confirm(`Are you sure you want to delete ${selectedTasks.size} selected quest(s)?`)) {
      return;
    }
    
    selectedTasks.forEach(taskId => {
      if (countdownIntervals.has(taskId)) {
        clearInterval(countdownIntervals.get(taskId));
        countdownIntervals.delete(taskId);
      }
      if (dailyTimers.has(taskId)) {
        clearInterval(dailyTimers.get(taskId));
        dailyTimers.delete(taskId);
      }
      exceptionTimestamps.delete(taskId);
      pausedTimerData.delete(taskId);
    });
    
    savePausedTimerData();
    saveExceptionTimestamps();
    
    tasks = tasks.filter(task => !selectedTasks.has(task.id));
    saveTasks();
    updateUI();
    exitSelectionMode();
  }

  function getTaskDisplayText(task) {
    if (task.type === 'regular') return task.text;
    
    if (task.type === 'countdown') {
      if (task.isException) {
        const pausedData = pausedTimerData.get(task.id);
        if (pausedData) {
          const remainingMinutes = Math.floor(pausedData.remainingTime / (60 * 1000));
          const remainingSeconds = Math.floor((pausedData.remainingTime % (60 * 1000)) / 1000);
          return `${task.text} (⏸️ ${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')})`;
        }
        return `${task.text} (⏸️ PAUSED)`;
      }
      
      const elapsed = Date.now() - task.countdownStartTime;
      const remaining = Math.max(0, task.countdownTime - elapsed);
      const remainingMinutes = Math.floor(remaining / (60 * 1000));
      const remainingSeconds = Math.floor((remaining % (60 * 1000)) / 1000);
      return `${task.text} (${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')})`;
    }
    
    const current = task.currentValue || 0;
    const target = task.targetValue || 0;
    
    if (task.type === 'time') {
      return `${task.text} (${formatTime(current)}/${formatTime(target)})`;
    } else {
      return `${task.text} (${current}/${target})`;
    }
  }

  function getProgressText(task) {
    if (task.type === 'countdown') {
      if (task.isException) {
        const pausedData = pausedTimerData.get(task.id);
        if (pausedData) {
          const remainingMinutes = Math.floor(pausedData.remainingTime / (60 * 1000));
          const remainingSeconds = Math.floor((pausedData.remainingTime % (60 * 1000)) / 1000);
          return `⏸️ ${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')} paused`;
        }
        return '⏸️ PAUSED';
      }
      
      const elapsed = Date.now() - task.countdownStartTime;
      const remaining = Math.max(0, task.countdownTime - elapsed);
      const remainingMinutes = Math.floor(remaining / (60 * 1000));
      const remainingSeconds = Math.floor((remaining % (60 * 1000)) / 1000);
      return `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')} remaining`;
    }
    
    const current = task.currentValue || 0;
    const target = task.targetValue || 0;
    
    if (task.type === 'time') {
      return `${formatTime(current)} / ${formatTime(target)}`;
    } else {
      return `${current} / ${target}`;
    }
  }

  function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  }

  function getProgressPercentage(task) {
    if (task.type === 'regular') return task.completed ? 100 : 0;
    
    if (task.type === 'countdown') {
      if (task.isException) {
        const pausedData = pausedTimerData.get(task.id);
        if (pausedData && task.countdownTime > 0) {
          return (pausedData.remainingTime / task.countdownTime) * 100;
        }
        return 0;
      }
      
      const elapsed = Date.now() - task.countdownStartTime;
      const remaining = Math.max(0, task.countdownTime - elapsed);
      return (remaining / task.countdownTime) * 100;
    }
    
    if (!task.targetValue || !task.currentValue) return 0;
    return Math.min((task.currentValue / task.targetValue) * 100, 100);
  }

  function getTaskProgressClass(task) {
    if (task.completed) return '';
    if (task.type === 'regular') return '';
    
    if (task.type === 'countdown') {
      if (task.isException) return 'countdown-paused';
      const progress = getProgressPercentage(task);
      if (progress < 25) return 'countdown-danger';
      return 'countdown-active';
    }
    
    const progress = getProgressPercentage(task);
    return progress > 0 ? 'in-progress' : '';
  }

  function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.isException) return;
    
    task.completed = !task.completed;
    
    if (task.completed) {
      addToCompletedArchive(task);
      
      if (task.type !== 'regular') {
        if (task.type === 'countdown') {
          if (countdownIntervals.has(taskId)) {
            clearInterval(countdownIntervals.get(taskId));
            countdownIntervals.delete(taskId);
          }
          if (window.profileManager) {
            window.profileManager.addCountdownBonus();
          }
          tasks = tasks.filter(t => t.id !== taskId);
          saveTasks();
          updateUI();
          if (window.confetti) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
          return;
        } else {
          task.currentValue = task.targetValue;
          if (dailyTimers.has(taskId)) {
            clearInterval(dailyTimers.get(taskId));
            dailyTimers.delete(taskId);
          }
        }
      }
    }
    
    saveTasks();
    updateUI();
    
    if (task.completed && window.confetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const isExpiredCountdown = task.type === 'countdown' && 
      (Date.now() - task.countdownStartTime) >= task.countdownTime;
    
    const isExpiredDaily = task.type !== 'countdown' && task.dailyStartTime && task.has24Hr &&
      (Date.now() - task.dailyStartTime) >= (24 * 60 * 60 * 1000);
    
    if (!isExpiredCountdown && !isExpiredDaily && !confirm('Are you sure you want to delete this quest?')) {
      return;
    }
    
    if (countdownIntervals.has(taskId)) {
      clearInterval(countdownIntervals.get(taskId));
      countdownIntervals.delete(taskId);
    }
    if (dailyTimers.has(taskId)) {
      clearInterval(dailyTimers.get(taskId));
      dailyTimers.delete(taskId);
    }
    
    exceptionTimestamps.delete(taskId);
    pausedTimerData.delete(taskId);
    
    savePausedTimerData();
    saveExceptionTimestamps();
    
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    updateUI();
  }

  function showProgressModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.isException) return;
    
    editingTaskId = taskId;
    progressInput.value = task.currentValue || 0;
    progressInput.max = task.targetValue;
    
    if (task.type === 'time') {
      progressUnit.style.display = 'block';
      progressUnitText.style.display = 'none';
      progressUnit.innerHTML = `
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
      `;
    } else {
      progressUnit.style.display = 'none';
      progressUnitText.style.display = 'block';
      progressUnitText.textContent = 'count';
    }
    
    progressModal.style.display = 'flex';
    progressInput.focus();
  }

  function hideProgressModal() {
    progressModal.style.display = 'none';
    editingTaskId = null;
    progressInput.value = '';
  }

  function handleUpdateProgress() {
    if (!editingTaskId) return;
    
    const task = tasks.find(t => t.id === editingTaskId);
    if (!task || task.isException) return;
    
    let newProgress = parseInt(progressInput.value);
    if (isNaN(newProgress) || newProgress < 0) {
      alert('Please enter a valid number');
      return;
    }
    
    if (task.type === 'time' && progressUnit.value === 'hours') {
      newProgress = newProgress * 60;
    }
    
    const maxProgress = task.targetValue || 0;
    const actualProgress = Math.min(newProgress, maxProgress);
    
    task.currentValue = actualProgress;
    task.completed = actualProgress >= maxProgress;
    
    if (task.completed) {
      addToCompletedArchive(task);
      if (dailyTimers.has(task.id)) {
        clearInterval(dailyTimers.get(task.id));
        dailyTimers.delete(task.id);
      }
    }
    
    saveTasks();
    updateUI();
    hideProgressModal();
    
    if (task.completed && window.confetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  function updateUI() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      tasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
      });
    }
    
    updateOverallProgress();
  }

  function updateOverallProgress() {
    const requiredTasks = tasks.filter(task => !task.isException && task.isRequired);
    const totalTasks = requiredTasks.length;
    const completedTasks = requiredTasks.filter(task => task.completed).length;
    
    const allNonExceptionTasks = tasks.filter(task => !task.isException);
    const allCompletedTasks = allNonExceptionTasks.filter(task => task.completed).length;
    const partiallyCompletedTasks = allNonExceptionTasks.filter(task => 
      !task.completed && task.type !== 'regular' && task.type !== 'countdown' && (task.currentValue || 0) > 0
    ).length;
    
    const overallProgressPercentage = allNonExceptionTasks.length > 0 
      ? allNonExceptionTasks.reduce((acc, task) => acc + getProgressPercentage(task), 0) / allNonExceptionTasks.length 
      : 0;
    
    overallProgress.style.width = `${overallProgressPercentage}%`;
    
    let progressText = `${allCompletedTasks}/${allNonExceptionTasks.length} Completed`;
    if (partiallyCompletedTasks > 0) {
      progressText += ` (${partiallyCompletedTasks} in progress)`;
    }
    progressNumbers.textContent = progressText;
    
    if (totalTasks > 0 && completedTasks === totalTasks) {
      playLevelUpEffect();
    }
  }

  function playLevelUpEffect() {
    if (window.profileManager) {
      window.profileManager.levelUp();
    }
    
    tasks.forEach(task => {
      if (!task.isException) {
        task.completed = false;
        if (task.type !== 'regular' && task.type !== 'countdown') {
          task.currentValue = 0;
        }
      }
    });
    saveTasks();
    
    setTimeout(() => {
      updateUI();
    }, 4000);
  }

  function saveTasks() {
    localStorage.setItem('soloTasks', JSON.stringify(tasks));
  }

  function loadTasks() {
    const saved = localStorage.getItem('soloTasks');
    if (saved) {
      try {
        tasks = JSON.parse(saved);
        tasks.forEach(task => {
          if (task.dailyStartTime === undefined && task.type !== 'countdown') {
            task.dailyStartTime = Date.now();
          }
          if (task.isException === undefined) {
            task.isException = false;
          }
          if (task.createdAt === undefined) {
            task.createdAt = Date.now();
          }
          if (task.has24Hr === undefined) {
            task.has24Hr = true;
          }
          if (task.isRequired === undefined) {
            task.isRequired = true;
          }
        });
        
        loadExceptionTimestamps();
      } catch (e) {
        console.error('Error loading tasks:', e);
        tasks = [];
      }
    }
  }

  function showCompletedTasksModal() {
    populateCompletedTasksTable();
    completedTasksModal.style.display = 'flex';
  }

  function showUncompletedTasksModal() {
    populateUncompletedTasksTable();
    uncompletedTasksModal.style.display = 'flex';
  }

  function populateCompletedTasksTable() {
    completedTasksTableBody.innerHTML = '';
    
    completedTasksArchive.forEach((task, index) => {
      const row = document.createElement('tr');
      const uniqueId = `completed_${index + 1}_${task.id}`;
      row.dataset.taskId = uniqueId;
      
      if (completedTasksSelectionMode && selectedCompletedTasks.has(uniqueId)) {
        row.classList.add('selected');
      }
      
      row.innerHTML = `
        <td>${index + 1}</td>
        <td class="task-name-cell">${task.text}</td>
        <td>${formatTaskDateTime(task.createdAt)}</td>
        <td>${formatTaskDateTime(task.completedAt)}</td>
        <td><span class="task-type-badge badge-${task.type}">${task.type}</span></td>
        <td>${getTaskMeasurement(task)}</td>
        <td>${task.has24Hr ? '✓' : '✗'}</td>
        <td>${task.isRequired ? '✓' : '✗'}</td>
        <td>
          <button class="task-table-btn add-btn" onclick="addCompletedTaskToActive('${task.id}')">ADD</button>
          <button class="task-table-btn remove-btn" onclick="removeCompletedTask('${task.id}')">REMOVE</button>
        </td>
      `;
      
      if (completedTasksSelectionMode) {
        row.addEventListener('click', (e) => {
          if (e.target.tagName === 'BUTTON') return;
          toggleCompletedTaskSelection(uniqueId);
        });
      }
      
      addCompletedTaskLongPressListeners(row, uniqueId);
      
      completedTasksTableBody.appendChild(row);
    });
  }

  function populateUncompletedTasksTable() {
    uncompletedTasksTableBody.innerHTML = '';
    
    uncompletedTasksArchive.forEach((task, index) => {
      const row = document.createElement('tr');
      const uniqueId = `uncompleted_${index + 1}_${task.id}`;
      row.dataset.taskId = uniqueId;
      
      if (uncompletedTasksSelectionMode && selectedUncompletedTasks.has(uniqueId)) {
        row.classList.add('selected');
      }
      
      row.innerHTML = `
        <td>${index + 1}</td>
        <td class="task-name-cell">${task.text}</td>
        <td>${formatTaskDateTime(task.createdAt)}</td>
        <td>${formatTaskDateTime(task.uncompletedAt)}</td>
        <td><span class="task-type-badge badge-${task.type}">${task.type}</span></td>
        <td>${getTaskMeasurement(task)}</td>
        <td>${task.has24Hr ? '✓' : '✗'}</td>
        <td>${task.isRequired ? '✓' : '✗'}</td>
        <td>
          <button class="task-table-btn add-btn" onclick="addUncompletedTaskToActive('${task.id}')">ADD</button>
          <button class="task-table-btn remove-btn" onclick="removeUncompletedTask('${task.id}')">REMOVE</button>
        </td>
      `;
      
      if (uncompletedTasksSelectionMode) {
        row.addEventListener('click', (e) => {
          if (e.target.tagName === 'BUTTON') return;
          toggleUncompletedTaskSelection(uniqueId);
        });
      }
      
      addUncompletedTaskLongPressListeners(row, uniqueId);
      
      uncompletedTasksTableBody.appendChild(row);
    });
  }

  function getTaskMeasurement(task) {
    if (task.type === 'regular') {
      return 'None';
    } else if (task.type === 'countdown') {
      const totalMinutes = Math.floor(task.countdownTime / (60 * 1000));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else if (task.type === 'time') {
      return formatTime(task.targetValue);
    } else if (task.type === 'count') {
      return task.targetValue.toString();
    }
    return 'Unknown';
  }

  function addCompletedTaskLongPressListeners(element, uniqueId) {
    element.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      startCompletedTaskLongPress(uniqueId, element);
    });
    
    element.addEventListener('mouseup', () => {
      cancelCompletedTaskLongPress(element);
    });
    
    element.addEventListener('mouseleave', () => {
      cancelCompletedTaskLongPress(element);
    });
    
    element.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startCompletedTaskLongPress(uniqueId, element);
    });
    
    element.addEventListener('touchend', (e) => {
      e.preventDefault();
      cancelCompletedTaskLongPress(element);
    });
    
    element.addEventListener('touchcancel', () => {
      cancelCompletedTaskLongPress(element);
    });
  }

  function addUncompletedTaskLongPressListeners(element, uniqueId) {
    element.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      startUncompletedTaskLongPress(uniqueId, element);
    });
    
    element.addEventListener('mouseup', () => {
      cancelUncompletedTaskLongPress(element);
    });
    
    element.addEventListener('mouseleave', () => {
      cancelUncompletedTaskLongPress(element);
    });
    
    element.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startUncompletedTaskLongPress(uniqueId, element);
    });
    
    element.addEventListener('touchend', (e) => {
      e.preventDefault();
      cancelUncompletedTaskLongPress(element);
    });
    
    element.addEventListener('touchcancel', () => {
      cancelUncompletedTaskLongPress(element);
    });
  }

  function startCompletedTaskLongPress(uniqueId, element) {
    element.classList.add('long-pressing');
    completedTaskLongPressTimer = setTimeout(() => {
      cancelCompletedTaskLongPress(element);
      enterCompletedTasksSelectionMode();
      toggleCompletedTaskSelection(uniqueId);
    }, 4000);
  }

  function startUncompletedTaskLongPress(uniqueId, element) {
    element.classList.add('long-pressing');
    uncompletedTaskLongPressTimer = setTimeout(() => {
      cancelUncompletedTaskLongPress(element);
      enterUncompletedTasksSelectionMode();
      toggleUncompletedTaskSelection(uniqueId);
    }, 4000);
  }

  function cancelCompletedTaskLongPress(element) {
    if (completedTaskLongPressTimer) {
      clearTimeout(completedTaskLongPressTimer);
      completedTaskLongPressTimer = null;
    }
    element.classList.remove('long-pressing');
  }

  function cancelUncompletedTaskLongPress(element) {
    if (uncompletedTaskLongPressTimer) {
      clearTimeout(uncompletedTaskLongPressTimer);
      uncompletedTaskLongPressTimer = null;
    }
    element.classList.remove('long-pressing');
  }

  function enterCompletedTasksSelectionMode() {
    completedTasksSelectionMode = true;
    selectedCompletedTasks.clear();
    completedTasksActions.style.display = 'flex';
    populateCompletedTasksTable();
  }

  function enterUncompletedTasksSelectionMode() {
    uncompletedTasksSelectionMode = true;
    selectedUncompletedTasks.clear();
    uncompletedTasksActions.style.display = 'flex';
    populateUncompletedTasksTable();
  }

  function exitCompletedTasksSelectionMode() {
    completedTasksSelectionMode = false;
    selectedCompletedTasks.clear();
    completedTasksActions.style.display = 'none';
    populateCompletedTasksTable();
  }

  function exitUncompletedTasksSelectionMode() {
    uncompletedTasksSelectionMode = false;
    selectedUncompletedTasks.clear();
    uncompletedTasksActions.style.display = 'none';
    populateUncompletedTasksTable();
  }

  function toggleCompletedTaskSelection(uniqueId) {
    if (selectedCompletedTasks.has(uniqueId)) {
      selectedCompletedTasks.delete(uniqueId);
    } else {
      selectedCompletedTasks.add(uniqueId);
    }
    populateCompletedTasksTable();
  }

  function toggleUncompletedTaskSelection(uniqueId) {
    if (selectedUncompletedTasks.has(uniqueId)) {
      selectedUncompletedTasks.delete(uniqueId);
    } else {
      selectedUncompletedTasks.add(uniqueId);
    }
    populateUncompletedTasksTable();
  }

  function toggleSelectAllCompletedTasks() {
    if (selectedCompletedTasks.size === completedTasksArchive.length) {
      selectedCompletedTasks.clear();
    } else {
      selectedCompletedTasks.clear();
      completedTasksArchive.forEach((task, index) => {
        const uniqueId = `completed_${index + 1}_${task.id}`;
        selectedCompletedTasks.add(uniqueId);
      });
    }
    populateCompletedTasksTable();
  }

  function toggleSelectAllUncompletedTasks() {
    if (selectedUncompletedTasks.size === uncompletedTasksArchive.length) {
      selectedUncompletedTasks.clear();
    } else {
      selectedUncompletedTasks.clear();
      uncompletedTasksArchive.forEach((task, index) => {
        const uniqueId = `uncompleted_${index + 1}_${task.id}`;
        selectedUncompletedTasks.add(uniqueId);
      });
    }
    populateUncompletedTasksTable();
  }

  window.addCompletedTaskToActive = function(taskId) {
    const archiveTask = completedTasksArchive.find(t => t.id === taskId);
    if (!archiveTask) return;
    
    const newTask = {
      id: Date.now().toString(),
      text: archiveTask.text,
      type: archiveTask.type,
      completed: false,
      targetValue: archiveTask.targetValue,
      currentValue: archiveTask.type === 'regular' ? null : 0,
      unit: archiveTask.unit,
      countdownTime: archiveTask.countdownTime,
      countdownStartTime: archiveTask.type === 'countdown' ? Date.now() : null,
      dailyStartTime: (archiveTask.type !== 'countdown' && archiveTask.has24Hr) ? Date.now() : null,
      isException: false,
      createdAt: Date.now(),
      has24Hr: archiveTask.has24Hr,
      isRequired: archiveTask.isRequired
    };
    
    tasks.push(newTask);
    saveTasks();
    updateUI();
    
    if (newTask.type === 'countdown') {
      startCountdownTimer(newTask.id);
    } else if (newTask.has24Hr) {
      startDailyTimer(newTask.id);
    }
  };

  window.addUncompletedTaskToActive = function(taskId) {
    const archiveTask = uncompletedTasksArchive.find(t => t.id === taskId);
    if (!archiveTask) return;
    
    const newTask = {
      id: Date.now().toString(),
      text: archiveTask.text,
      type: archiveTask.type,
      completed: false,
      targetValue: archiveTask.targetValue,
      currentValue: archiveTask.type === 'regular' ? null : 0,
      unit: archiveTask.unit,
      countdownTime: archiveTask.countdownTime,
      countdownStartTime: archiveTask.type === 'countdown' ? Date.now() : null,
      dailyStartTime: (archiveTask.type !== 'countdown' && archiveTask.has24Hr) ? Date.now() : null,
      isException: false,
      createdAt: Date.now(),
      has24Hr: archiveTask.has24Hr,
      isRequired: archiveTask.isRequired
    };
    
    tasks.push(newTask);
    saveTasks();
    updateUI();
    
    if (newTask.type === 'countdown') {
      startCountdownTimer(newTask.id);
    } else if (newTask.has24Hr) {
      startDailyTimer(newTask.id);
    }
  };

  window.removeCompletedTask = function(taskId) {
    if (!confirm('Are you sure you want to remove this task from the archive?')) {
      return;
    }
    
    completedTasksArchive = completedTasksArchive.filter(t => t.id !== taskId);
    saveTaskArchives();
    populateCompletedTasksTable();
  };

  window.removeUncompletedTask = function(taskId) {
    if (!confirm('Are you sure you want to remove this task from the archive?')) {
      return;
    }
    
    uncompletedTasksArchive = uncompletedTasksArchive.filter(t => t.id !== taskId);
    saveTaskArchives();
    populateUncompletedTasksTable();
  };

  function addAllSelectedCompletedTasks() {
    selectedCompletedTasks.forEach(uniqueId => {
      const taskId = uniqueId.split('_').slice(2).join('_');
      window.addCompletedTaskToActive(taskId);
    });
    exitCompletedTasksSelectionMode();
  }

  function addAllSelectedUncompletedTasks() {
    selectedUncompletedTasks.forEach(uniqueId => {
      const taskId = uniqueId.split('_').slice(2).join('_');
      window.addUncompletedTaskToActive(taskId);
    });
    exitUncompletedTasksSelectionMode();
  }

  function removeAllSelectedCompletedTasks() {
    if (!confirm(`Are you sure you want to remove ${selectedCompletedTasks.size} selected task(s) from the archive?`)) {
      return;
    }
    
    selectedCompletedTasks.forEach(uniqueId => {
      const taskId = uniqueId.split('_').slice(2).join('_');
      completedTasksArchive = completedTasksArchive.filter(t => t.id !== taskId);
    });
    
    saveTaskArchives();
    exitCompletedTasksSelectionMode();
  }

  function removeAllSelectedUncompletedTasks() {
    if (!confirm(`Are you sure you want to remove ${selectedUncompletedTasks.size} selected task(s) from the archive?`)) {
      return;
    }
    
    selectedUncompletedTasks.forEach(uniqueId => {
      const taskId = uniqueId.split('_').slice(2).join('_');
      uncompletedTasksArchive = uncompletedTasksArchive.filter(t => t.id !== taskId);
    });
    
    saveTaskArchives();
    exitUncompletedTasksSelectionMode();
  }

  function addAndRemoveAllSelectedCompletedTasks() {
    selectedCompletedTasks.forEach(uniqueId => {
      const taskId = uniqueId.split('_').slice(2).join('_');
      window.addCompletedTaskToActive(taskId);
    });
    
    selectedCompletedTasks.forEach(uniqueId => {
      const taskId = uniqueId.split('_').slice(2).join('_');
      completedTasksArchive = completedTasksArchive.filter(t => t.id !== taskId);
    });
    
    saveTaskArchives();
    exitCompletedTasksSelectionMode();
  }

  function addAndRemoveAllSelectedUncompletedTasks() {
    selectedUncompletedTasks.forEach(uniqueId => {
      const taskId = uniqueId.split('_').slice(2).join('_');
      window.addUncompletedTaskToActive(taskId);
    });
    
    selectedUncompletedTasks.forEach(uniqueId => {
      const taskId = uniqueId.split('_').slice(2).join('_');
      uncompletedTasksArchive = uncompletedTasksArchive.filter(t => t.id !== taskId);
    });
    
    saveTaskArchives();
    exitUncompletedTasksSelectionMode();
  }

  const secretDaggerIcon = document.getElementById('secretDaggerIcon');
  const secretDungeonModal = document.getElementById('secretDungeonModal');
  const notesBtn = document.getElementById('notesBtn');
  const notesModal = document.getElementById('notesModal');
  const closeNotesBtn = document.getElementById('closeNotesBtn');
  const saveNotesBtn = document.getElementById('saveNotesBtn');
  const notesTextarea = document.getElementById('notesTextarea');
  const closeSecretBtn = document.getElementById('closeSecretBtn');
  
  function loadSecretState() {
    const secretState = localStorage.getItem('secretDaggerVisible');
    if (secretState === 'true') {
      secretDaggerIcon.style.display = 'flex';
    }
    
    const savedNotes = localStorage.getItem('shadowNotes');
    if (savedNotes) {
      notesTextarea.value = savedNotes;
    }
  }
  
  function saveSecretState(isVisible) {
    localStorage.setItem('secretDaggerVisible', isVisible.toString());
  }
  
  secretDaggerIcon.addEventListener('click', () => {
    secretDungeonModal.style.display = 'flex';
  });
  
  closeSecretBtn.addEventListener('click', () => {
    secretDungeonModal.style.display = 'none';
  });
  
  notesBtn.addEventListener('click', () => {
    secretDungeonModal.style.display = 'none';
    notesModal.style.display = 'flex';
  });
  
  let unsavedNotes = "";

  notesBtn.addEventListener('click', () => {
    secretDungeonModal.style.display = 'none';
    unsavedNotes = localStorage.getItem('shadowNotes') || '';
    notesTextarea.value = unsavedNotes;
    notesModal.style.display = 'flex';
  });

  saveNotesBtn.addEventListener('click', () => {
    const text = notesTextarea.value;
    localStorage.setItem('shadowNotes', text);
    unsavedNotes = text; 
    saveNotesBtn.textContent = 'SAVED!';
    notesModal.style.display = 'none';
    setTimeout(() => {
      saveNotesBtn.textContent = 'Save Notes';
    }, 2000);
  });

  closeNotesBtn.addEventListener('click', () => {
    if (notesTextarea.value !== unsavedNotes) {
      const confirmDiscard = confirm("You have unsaved changes. Discard them?");
      if (!confirmDiscard) return;
    }
    notesTextarea.value = unsavedNotes;
    notesModal.style.display = 'none';
  });

  notesModal.addEventListener('click', (e) => {
    if (e.target === notesModal) {
      if (notesTextarea.value !== unsavedNotes) {
        const confirmDiscard = confirm("You have unsaved changes. Discard them?");
        if (!confirmDiscard) return;
      }
      notesTextarea.value = unsavedNotes;
      notesModal.style.display = 'none';
    }
  });
  
  loadSecretState();
     
});
