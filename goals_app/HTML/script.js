document.addEventListener('DOMContentLoaded', () => {
    const goalContainer = document.getElementById('goal-container');
    const addGoalButton = document.getElementById('add-goal-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const createGoalButton = document.getElementById('create-goal-btn');
    const cancelGoalButton = document.getElementById('cancel-goal-btn');
    const goalTypeSelect = document.getElementById('goal-type');
    const timedOptions = document.getElementById('timed-options');
    const timePeriodInput = document.getElementById('time-period');
    const titleInput = document.getElementById('title');

    addGoalButton.addEventListener('click', () => {
        modalOverlay.style.display = 'block';
    });

    cancelGoalButton.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
    });

    createGoalButton.addEventListener('click', () => {
        const title = titleInput.value;
        const type = goalTypeSelect.value;
        const timePeriod = parseInt(timePeriodInput.value, 10);
        const threshold = type === 'timed' ? null : parseInt(document.getElementById('threshold').value, 10) || 100;

        if (title.trim() === '') {
            alert('Please enter a title for your goal.');
            return;
        }

        createNewGoal(title, type, timePeriod, threshold);
        modalOverlay.style.display = 'none';
    });

    goalContainer.addEventListener('click', (event) => {
        const targetButton = event.target;
        if (targetButton.classList.contains('plus-btn')) {
            updateGoalProgress(targetButton, 1);
        } else if (targetButton.classList.contains('minus-btn')) {
            updateGoalProgress(targetButton, -1);
        }
    });

    function createNewGoal(title, type, timePeriod, threshold) {
        let existingGoalContainer = document.getElementById('goal-container');
    
        if (!existingGoalContainer) {
            existingGoalContainer = document.createElement('div');
            existingGoalContainer.id = 'goal-container';
            document.body.appendChild(existingGoalContainer);
        }
    
        const newGoalContainer = document.createElement('div');
        newGoalContainer.classList.add('goal-container');
    
        const goalTitleElement = document.createElement('div');
        goalTitleElement.classList.add('goal-title');
        goalTitleElement.textContent = title;
    
        const progressBarContainer = document.createElement('div');
        progressBarContainer.classList.add('progress-bar-container');
    
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBar.dataset.progress = '0';
    
        progressBarContainer.appendChild(progressBar);
    
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('goal-buttons');
    
        newGoalContainer.appendChild(goalTitleElement);
        newGoalContainer.appendChild(progressBarContainer);
        newGoalContainer.appendChild(buttonContainer);
    
        existingGoalContainer.insertBefore(newGoalContainer, existingGoalContainer.firstChild);
    
        if (type === 'progressional') {
            startProgressionalGoal(newGoalContainer, title, threshold);
        } else if (type === 'timed') {
            startTimedGoal(progressBar, timePeriod, title);
        }
    
        modalOverlay.style.display = 'none';
    }

    function startProgressionalGoal(existingGoalContainer, title, threshold) {
        const goalContainer = document.createElement('div');
        goalContainer.classList.add('goal-container');
    
        const goalTitleElement = document.createElement('div');
        goalTitleElement.classList.add('goal-title');
        goalTitleElement.textContent = title;
    
        const progressBarContainer = document.createElement('div');
        progressBarContainer.classList.add('progress-bar-container');
    
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBar.dataset.progress = '0';
    
        progressBarContainer.appendChild(progressBar);
    
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('goal-buttons');
    
        const plusButton = document.createElement('button');
        plusButton.classList.add('plus-btn');
        plusButton.textContent = '+1';
        plusButton.addEventListener('click', () => updateGoalProgress(plusButton, 1, threshold));
    
        const minusButton = document.createElement('button');
        minusButton.classList.add('minus-btn');
        minusButton.textContent = '-1';
        minusButton.addEventListener('click', () => updateGoalProgress(minusButton, -1, threshold));
    
        buttonContainer.appendChild(plusButton);
        buttonContainer.appendChild(minusButton);
    
        goalContainer.appendChild(goalTitleElement);
        goalContainer.appendChild(progressBarContainer);
        goalContainer.appendChild(buttonContainer);
    
        existingGoalContainer.insertBefore(goalContainer, existingGoalContainer.firstChild);
    }
      
    function startTimedGoal(progressBar, timePeriod, title) {
        let progressValue = 0;
        const interval = (timePeriod * 60 * 1000) / 100;
      
        const timerId = setInterval(() => {
        if (progressValue < 100) {
            progressValue += 1;
            updateProgressBar(progressBar, progressValue);
        } else {
            clearInterval(timerId);
            showNotification(title);
        }}, interval);
    }

    function updateGoalProgress(button, increment) {
        const goalContainer = button.closest('.goal-container');
        const progressBar = goalContainer.querySelector('.progress-bar');

        let progressValue = parseInt(progressBar.dataset.progress, 10) + increment;
        progressValue = Math.min(threshold, Math.max(0, progressValue));

        progressBar.dataset.progress = progressValue;
        progressBar.style.width = `${(progressValue / threshold) * 100}%`;
    }

    function updateProgressBar(progressBar, progressValue) {
        progressValue = Math.min(100, Math.max(0, progressValue)); 
        progressBar.dataset.progress = progressValue;
        progressBar.style.width = `${progressValue}%`;
    }

    goalTypeSelect.addEventListener('change', () => {
        const thresholdInput = document.getElementById('threshold');

        if (goalTypeSelect.value === 'timed') {
            timedOptions.style.display = 'block';
            thresholdInput.style.display = 'none';
        } else {
            timedOptions.style.display = 'none';
            thresholdInput.style.display = 'block';
        }
    });

    function showNotification(title) {
        const notificationsContainer = document.getElementById('notifications-container');
    
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = `${title} completed!`;
    
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.classList.add('notification-close-btn');
        closeButton.addEventListener('click', () => {
          notification.classList.remove('show');
          setTimeout(() => {
            notificationsContainer.removeChild(notification);
          }, 300);
        });
    
        notification.appendChild(closeButton);
    
        notificationsContainer.appendChild(notification);
    
        setTimeout(() => {
          notification.classList.add('show');
        }, 10);
      }
});