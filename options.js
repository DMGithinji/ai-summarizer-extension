document.addEventListener('DOMContentLoaded', function() {
  let currentSettings = {
    promptTemplate: '',
    aiUrl: ''
  };

  const defaultAI = "https://chatgpt.com?summarize-extension";
  const defaultPrompt = `Please provide a summary of the following content:

1. First, give a concise one-sentence summary that captures the core message/theme
2. Then, provide key points as bullet points (use suitable emojis for each point)
3. Expound briefly on each bullet point if there's need.
4. Include any notable quotes or statistics
5. End with a brief takeaway

Content to summarize: ➡️➡️➡️
{{content}}`;

  // Load saved settings
  function loadSettings() {
    defaultAI
    chrome.storage.sync.get({
      promptTemplate: defaultPrompt,
      aiUrl: defaultAI,
    }, function(items) {
      // Store current settings
      currentSettings = {
        promptTemplate: items.promptTemplate,
        aiUrl: items.aiUrl
      };

      // Set prompt template
      document.getElementById('promptTemplate').value = items.promptTemplate;

      // Highlight selected AI button
      const buttons = document.querySelectorAll('.ai-btn');
      buttons.forEach(button => {
        button.classList.remove('selected');
        if (button.dataset.url === items.aiUrl) {
          button.classList.add('selected');
        }
      });

      // Initially disable save button
      updateSaveButtonState();
    });
  }

  // Check if current state differs from saved state
  function hasChanges() {
    const promptTemplate = document.getElementById('promptTemplate').value;
    const selectedAI = document.querySelector('.ai-btn.selected');
    const currentAiUrl = selectedAI ? selectedAI.dataset.url : 'https://claude.ai/chat';

    return promptTemplate !== currentSettings.promptTemplate ||
           currentAiUrl !== currentSettings.aiUrl;
  }

  // Update save button state
  function updateSaveButtonState() {
    const saveButton = document.getElementById('save');
    const hasUnsavedChanges = hasChanges();

    saveButton.disabled = !hasUnsavedChanges;
    saveButton.classList.toggle('disabled', !hasUnsavedChanges);
  }

  // Handle AI selection
  function setupAIButtons() {
    document.querySelectorAll('.ai-btn').forEach(button => {
      button.addEventListener('click', function() {
        // Remove selection from all buttons
        document.querySelectorAll('.ai-btn')
          .forEach(btn => btn.classList.remove('selected'));

        // Add selection to clicked button
        this.classList.add('selected');

        // Update save button state
        updateSaveButtonState();
      });
    });
  }

  // Save settings
  function saveSettings() {
    const promptTemplate = document.getElementById('promptTemplate').value;
    const selectedAI = document.querySelector('.ai-btn.selected');
    const aiUrl = selectedAI ? selectedAI.dataset.url : 'https://claude.ai/chat';

    chrome.storage.sync.set({
      promptTemplate: promptTemplate || defaultPrompt,
      aiUrl: aiUrl
    }, function() {
      // Update current settings
      currentSettings = {
        promptTemplate: promptTemplate || defaultPrompt,
        aiUrl: aiUrl
      };

      // Show success message
      const status = document.getElementById('status');
      status.textContent = 'Settings saved successfully!';
      status.classList.add('show');

      setTimeout(() => {
        status.classList.remove('show');
      }, 2000);

      // Update save button state
      updateSaveButtonState();
    });
  }

  // Initialize event listeners
  function initializeEventListeners() {
    // Save button
    document.getElementById('save').addEventListener('click', saveSettings);

    // Prompt template changes
    document.getElementById('promptTemplate').addEventListener('input', updateSaveButtonState);

    // Setup AI buttons
    setupAIButtons();
  }

  // Initialize everything
  function initialize() {
    loadSettings();
    initializeEventListeners();
  }

  // Start the initialization
  initialize();
});