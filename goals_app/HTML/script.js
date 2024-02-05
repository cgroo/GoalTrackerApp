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
    const notificationsContainer = document.getElementById('notifications-container');
    let counter;  // Declare counter as a global variable

    addGoalButton.addEventListener('click', () => {
        modalOverlay.style.display = 'block';
        clearGoalForm();
    });

    cancelGoalButton.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
    });

    goalTypeSelect.addEventListener('change', () => {
        const thresholdLabel = document.querySelector('label[for="threshold"]');
        const thresholdInput = document.getElementById('threshold');
        const timePeriodRow = document.getElementById('time-period-row');

        if (goalTypeSelect.value === 'timed') {
            timedOptions.style.display = 'block';
            thresholdLabel.classList.add('disabled-label');
            thresholdInput.setAttribute('disabled', 'true');
            timePeriodRow.style.display = 'flex';
        } else {
            timedOptions.style.display = 'none';
            thresholdLabel.classList.remove('disabled-label');
            thresholdInput.removeAttribute('disabled');
            timePeriodRow.style.display = 'none';
        }
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

        modalOverlay.style.display = 'none';

        // Create a unique ID for each goal to ensure uniqueness
        const goalId = `goal-${Date.now()}`;

        const existingGoalContainer = document.getElementById('goal-container');

        if (type === 'progressional') {
            createNewProgressionalGoal(existingGoalContainer, goalId, threshold, title);
        } else if (type === 'timed') {
            createNewTimedGoal(existingGoalContainer, goalId, timePeriod, title);
        }
    });

    function createNewProgressionalGoal(existingGoalContainer, goalId, threshold, title) {
        let timed = false;
        const { newGoalContainer, progressBar, progressCounter } = createGoalContainer(goalId, title, threshold, timed);
        existingGoalContainer.insertBefore(newGoalContainer, existingGoalContainer.firstChild);
        counter = { progressBar, progressCounter };

        startProgress(goalId, threshold);
    }

    function createNewTimedGoal(existingGoalContainer, goalId, timePeriod, title) {
        let timed = true;
        const { newGoalContainer, progressBar, progressCounter } = createGoalContainer(goalId, title, 100, timed);
        existingGoalContainer.insertBefore(newGoalContainer, existingGoalContainer.firstChild);
        counter = { progressBar, progressCounter };

        startTimedGoal(goalId, timePeriod, title);
    }

    function createGoalContainer(goalId, title, threshold, isTimed) {
        const newGoalContainer = document.createElement('div');
        newGoalContainer.classList.add('goal-container');
        newGoalContainer.id = goalId;

        const goalTitleElement = document.createElement('div');
        goalTitleElement.classList.add('goal-title');
        goalTitleElement.textContent = title;

        const progressBarContainer = document.createElement('div');
        progressBarContainer.classList.add('progress-bar-container');

        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBar.dataset.progress = '0';

        const counterContainer = document.createElement('div');
        counterContainer.classList.add('counter-container');

        const progressCounter = document.createElement('div');
        progressCounter.classList.add('counter');
        progressCounter.textContent = `0/${threshold}`;
        
        progressBarContainer.appendChild(progressBar);
        counterContainer.appendChild(progressCounter);
        progressBarContainer.appendChild(counterContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('goal-buttons');

        if (!isTimed) {
            const plusButton = document.createElement('button');
            plusButton.classList.add('plus-btn');
            plusButton.textContent = '+1';
            plusButton.addEventListener('click', () => updateGoalProgress(goalId, 1, threshold));

            const minusButton = document.createElement('button');
            minusButton.classList.add('minus-btn');
            minusButton.textContent = '-1';
            minusButton.addEventListener('click', () => updateGoalProgress(goalId, -1, threshold));

            buttonContainer.appendChild(minusButton);
            buttonContainer.appendChild(plusButton);
        }

        newGoalContainer.appendChild(goalTitleElement);
        newGoalContainer.appendChild(progressBarContainer);
        newGoalContainer.appendChild(buttonContainer);

        return { newGoalContainer, progressBar, progressCounter };
    }

    function startTimedGoal(goalId, timePeriod, title) {
        let remainingTime = timePeriod * 60;
    
        const progressBar = document.getElementById(goalId).querySelector('.progress-bar');
        const progressCounter = document.getElementById(goalId).querySelector('.counter');
    
        function updateTimer() {
            if (remainingTime > 0) {
                remainingTime -= 1;
                const minutes = Math.floor(remainingTime / 60);
                const seconds = remainingTime % 60;
                progressCounter.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                updateProgressBar(progressBar, (timePeriod * 60 - remainingTime) / (timePeriod * 60) * 100);
                setTimeout(updateTimer, 1000);
            } else {
                showNotification(title);
            }
        }
    
        updateTimer();
    }
    

    function updateGoalProgress(goalId, increment, threshold) {
        const progressBar = counter.progressBar;

        let progressValue = parseInt(progressBar.dataset.progress, 10) + increment;
        progressValue = Math.min(threshold, Math.max(0, progressValue));

        progressBar.dataset.progress = progressValue;
        progressBar.style.width = `${(progressValue / threshold) * 100}%`;
        
        counter.progressCounter.textContent = `${progressValue}/${threshold}`;
        if (progressValue === threshold) {
            showNotification(document.getElementById(goalId).querySelector('.goal-title').textContent);
        }
    }

    function updateProgressBar(progressBar, progressValue) {
        progressValue = Math.min(100, Math.max(0, progressValue));
        progressBar.dataset.progress = progressValue;
        progressBar.style.width = `${progressValue}%`;
    }

    function showNotification(title) {
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

        notificationsContainer.insertBefore(notification, notificationsContainer.firstChild);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    }

    function formatTimeRemaining(milliseconds) {
        const minutes = Math.floor(milliseconds / (60 * 1000));
        const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
        const millisecondsPart = milliseconds % 1000;
        return `${minutes}:${seconds}:${millisecondsPart}`;
    }

    function clearGoalForm() {
        titleInput.value = '';
        goalTypeSelect.value = 'progressional';
        timePeriodInput.value = '';
        document.getElementById('threshold').value = '100';
        timedOptions.style.display = 'none';
        document.querySelector('label[for="threshold"]').classList.remove('disabled-label');
        document.getElementById('threshold').removeAttribute('disabled');
        document.getElementById('time-period-row').style.display = 'none';
    }
});
