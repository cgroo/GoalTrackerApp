import { joinSpace } from './spaces.js';

document.addEventListener('DOMContentLoaded', () => {
  const nameForm = document.getElementById('name-form');
  const usernameInput = document.getElementById('username-input');
  const joinSpaceField = document.getElementById('join-space-field');
  const spaceNameInput = document.getElementById('space-name-input');

  nameForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = usernameInput.value.trim();
      if (username) {
          // Show the join space field
          joinSpaceField.style.display = 'block';
          const spaceName = spaceNameInput.value.trim();
          if (spaceName) {
            await joinSpace(username, spaceName);
          }
      }
  });
});