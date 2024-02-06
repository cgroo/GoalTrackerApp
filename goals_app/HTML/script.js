document.addEventListener('DOMContentLoaded', () => {
    const ongoingTab = document.getElementById('ongoing-tab');
    const completedTab = document.getElementById('completed-tab');
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
    let ongoingGoals = {}; // Array to store ongoing goals
    let completedGoals = {}; // Array to store completed goals

    ongoingTab.addEventListener('click', () => { // Handles user click on ongoing goals tab
        ongoingTab.classList.add('active');
        completedTab.classList.remove('active');
        goalContainer.classList.remove('completed-goals');
        addGoalButton.style.display = 'block';
      });
    
      completedTab.addEventListener('click', () => { // Handles user click on completed goals tab
        completedTab.classList.add('active');
        ongoingTab.classList.remove('active');
        goalContainer.classList.add('completed-goals');
        addGoalButton.style.display = 'none';
      });

    addGoalButton.addEventListener('click', () => { // Handles user click on add goal button
        modalOverlay.style.display = 'block';
        clearGoalForm();
    });

    cancelGoalButton.addEventListener('click', () => { // Handles user click on cancel adding goal button
        modalOverlay.style.display = 'none';
    });

    goalTypeSelect.addEventListener('change', () => { // Handles user change goal type in adding goal menu
        const thresholdLabel = document.querySelector('label[for="threshold"]');
        const thresholdInput = document.getElementById('threshold');
        const timePeriodRow = document.getElementById('time-period-row');

        if (goalTypeSelect.value === 'timed') { // If time goal
            timedOptions.style.display = 'block';
            thresholdLabel.classList.add('disabled-label');
            thresholdInput.setAttribute('disabled', 'true');
            timePeriodRow.style.display = 'flex';
        } else { // If progressional goal
            timedOptions.style.display = 'none';
            thresholdLabel.classList.remove('disabled-label');
            thresholdInput.removeAttribute('disabled');
            timePeriodRow.style.display = 'none';
        }
    });

    createGoalButton.addEventListener('click', () => { // Create goal
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
            createNewGoal(existingGoalContainer, goalId, threshold, title, false);
            startProgress(goalId, threshold);
        } else if (type === 'timed') {
            createNewGoal(existingGoalContainer, goalId, 100, title, true);
            startTimedGoal(goalId, timePeriod, title);
        }
    });

    function createNewGoal(existingGoalContainer, goalId, threshold, title, isTimed) { // Make virtual goal on screen real estate
        const { newGoalContainer, progressBar, progressCounter } = createGoalContainer(goalId, title, threshold, isTimed);
        existingGoalContainer.insertBefore(newGoalContainer, existingGoalContainer.firstChild);

        // Store progress information for each goal
        ongoingGoals[goalId] = { progressBar, progressCounter, threshold, isTimed, progressValue: 0 };
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
        const goal = ongoingGoals[goalId];

        let progressValue = goal.progressValue + increment;
        progressValue = Math.min(threshold, Math.max(0, progressValue));

        goal.progressBar.dataset.progress = progressValue;
        goal.progressBar.style.width = `${(progressValue / threshold) * 100}%`;

        goal.progressCounter.textContent = `${progressValue}/${threshold}`;
        goal.progressValue = progressValue;

        if (progressValue === threshold) {
            showNotification(document.getElementById(goalId).querySelector('.goal-title').textContent);

        }
    }

    function updateProgressBar(progressBar, progressValue) {
        progressValue = Math.min(100, Math.max(0, progressValue));
        progressBar.dataset.progress = progressValue;
        progressBar.style.width = `${progressValue}%`;
    }

    let completedGoalsCount = 0;

    function showNotification(title) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = `${title} completed!`;
    
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.classList.add('notification-close-btn');
        closeButton.addEventListener('click', () => {
            notification.classList.add('removed');
            notification.classList.remove('show');
            delete ongoingGoals[goalId];
            setTimeout(() => {
                notificationsContainer.removeChild(notification);
                updateNotificationPositions();
            }, 300);
        });
    
        notification.appendChild(closeButton);
    
        notificationsContainer.appendChild(notification); // Append at the bottom
    
        setTimeout(() => {
            notification.classList.add('show');
            completedGoalsCount += 1;
            updateTabTitle();
            updateNotificationPositions();
        }, 10);
    }
    
    function updateNotificationPositions() {
        const notifications = notificationsContainer.querySelectorAll('.notification');
        let offset = 0;
    
        notifications.forEach((notification, index) => {
            notification.style.transition = 'bottom 0.3s ease-in-out';
            notification.style.bottom = `${offset}px`;
            offset += notification.offsetHeight + 10; // Adjust 10 pixels for spacing
    
            // If a notification is removed, update positions above it
            if (notification.classList.contains('removed')) {
                const remainingNotifications = notifications.length - index - 1;
                for (let i = index + 1; i < notifications.length; i++) {
                    const aboveNotification = notifications[i];
                    aboveNotification.style.bottom = `${parseInt(aboveNotification.style.bottom) - notification.offsetHeight - 10}px`;
                }
            }
        });
    }
    // Add this event listener to update positions on window resize
    window.addEventListener('resize', updateNotificationPositions);
    
    function updateTabTitle() {
        if (completedGoalsCount > 0) {
            document.title = `(${completedGoalsCount}) Goals Completed`;
        } else {
            document.title = 'Goal Tracker';
        }
    }
    
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            completedGoalsCount = 0;
            updateTabTitle();
        }
    });

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