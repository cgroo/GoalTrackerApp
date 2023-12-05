document.addEventListener('DOMContentLoaded', () => {
    const goalContainer = document.getElementById('goal-container');
    const addGoalButton = document.getElementById('add-goal-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const goalForm = document.getElementById('goal-form');
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

        if (title.trim() === '') {
            alert('Please enter a title for your goal.');
            return;
        }

        createNewGoal(title, type, timePeriod);
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

    function createNewGoal(title, type, timePeriod) {
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
      
        const plusButton = document.createElement('button');
        plusButton.classList.add('plus-btn');
        plusButton.textContent = '+1';
      
        const minusButton = document.createElement('button');
        minusButton.classList.add('minus-btn');
        minusButton.textContent = '-1';
      
        buttonContainer.appendChild(plusButton);
        buttonContainer.appendChild(minusButton);

        newGoalContainer.appendChild(goalTitleElement);
        newGoalContainer.appendChild(progressBarContainer);
        newGoalContainer.appendChild(buttonContainer);

        // Append the new goal container before the "Add Goal" button
        existingGoalContainer.insertBefore(newGoalContainer, existingGoalContainer.firstChild);

        if (type === 'timed') {
            startTimedGoal(progressBar, timePeriod);
        }
    }

    function startTimedGoal(progressBar, timePeriod) {
        let progressValue = 0;
        const interval = (timePeriod * 60 * 1000) / 100; // Adjust interval based on timePeriod

        const timerId = setInterval(() => {
            if (progressValue < 100) {
                progressValue += 1;
                updateProgressBar(progressBar, progressValue);
            } else {
                clearInterval(timerId);
            }
        }, interval);
    }

    function updateGoalProgress(button, increment) {
        const goalContainer = button.closest('.goal-container');
        const progressBar = goalContainer.querySelector('.progress-bar');

        let progressValue = parseInt(progressBar.dataset.progress, 10) + increment;
        progressValue = Math.min(100, Math.max(0, progressValue)); // Ensure progress is within [0, 100]

        progressBar.dataset.progress = progressValue;
        progressBar.style.width = `${progressValue}%`;
    }

    function updateProgressBar(progressBar, progressValue) {
        progressValue = Math.min(100, Math.max(0, progressValue)); // Ensure progress is within [0, 100]
        progressBar.dataset.progress = progressValue;
        progressBar.style.width = `${progressValue}%`;
    }

    goalTypeSelect.addEventListener('change', () => {
        if (goalTypeSelect.value === 'timed') {
            timedOptions.style.display = 'block';
        } else {
            timedOptions.style.display = 'none';
        }
    });
});