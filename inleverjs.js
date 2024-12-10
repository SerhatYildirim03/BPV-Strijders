// Voeg bestand toe aan Recent Geüpload
const uploadBox = document.getElementById('uploadBox');
const uploadLink = document.getElementById('uploadLink');
const fileInput = document.getElementById('fileInput');
const recentUploads = document.getElementById('recentUploads');

// Open bestandsverkenner
uploadBox.addEventListener('click', () => fileInput.click());
uploadLink.addEventListener('click', (e) => {
  e.preventDefault(); // Voorkom standaard linkgedrag
  fileInput.click();
});

// Functie om notificatie te tonen
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  audio.play();
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

// Functie om een bestandsitem aan te maken
function createFileItem(fileInfo) {
  const fileItem = document.createElement('div');
  fileItem.classList.add('file-item');

  const fileLink = document.createElement('a');
  fileLink.href = fileInfo.url || '#';
  fileLink.textContent = fileInfo.name;
  fileLink.target = "_blank";

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Verwijder';
  removeButton.classList.add('remove-button');
  removeButton.addEventListener('click', () => {
    recentUploads.removeChild(fileItem);
    // Update localStorage na verwijderen
    const files = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    const updatedFiles = files.filter(f => f.name !== fileInfo.name);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
  });

  fileItem.appendChild(fileLink);
  fileItem.appendChild(removeButton);
  recentUploads.appendChild(fileItem);
}

// Bestandsupload event listener
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    // Maak een fileInfo object
    const fileInfo = {
      name: file.name,
      url: URL.createObjectURL(file),
      timestamp: new Date().toISOString()
    };

    // Sla het bestand op in localStorage
    const existingFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    existingFiles.push(fileInfo);
    localStorage.setItem('uploadedFiles', JSON.stringify(existingFiles));

    // Maak het bestandsitem aan in de UI
    createFileItem(fileInfo);

    // Toon notificatie
    showNotification('Deadline behaald! Bestand succesvol geüpload.');
  }
});

// Upload box drag & drop functionaliteit
uploadBox.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadBox.style.borderColor = '#0d6efd';
  uploadBox.style.backgroundColor = '#f1f8ff';
});

uploadBox.addEventListener('dragleave', (e) => {
  e.preventDefault();
  uploadBox.style.borderColor = '#dee2e6';
  uploadBox.style.backgroundColor = '#f8f9fa';
});

uploadBox.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadBox.style.borderColor = '#dee2e6';
  uploadBox.style.backgroundColor = '#f8f9fa';
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    const event = new Event('change');
    fileInput.dispatchEvent(event);
  }
});

// Laad opgeslagen bestanden bij het opstarten
document.addEventListener('DOMContentLoaded', () => {
  const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
  savedFiles.forEach(fileInfo => createFileItem(fileInfo));
});

// Upload link click handler
uploadLink.addEventListener('click', (e) => {
  e.preventDefault();
  fileInput.click();
});

// Feedback functionaliteit
const feedbackName = document.getElementById('feedbackName');
const feedbackMessage = document.getElementById('feedbackMessage');
const submitFeedback = document.getElementById('submitFeedback');
const feedbackDisplay = document.getElementById('feedbackDisplay');

submitFeedback.addEventListener('click', () => {
  const name = feedbackName.value.trim();
  const message = feedbackMessage.value.trim();

  if (name && message) {
    const feedbackItem = document.createElement('div');
    feedbackItem.classList.add('feedback-item');
    feedbackItem.innerHTML = `<strong>${name}</strong>: <p>${message}</p>`;
    feedbackDisplay.appendChild(feedbackItem);

    // Velden wissen na invoer
    feedbackName.value = '';
    feedbackMessage.value = '';
  } else {
    alert('Vul zowel uw naam als feedback in.');
  }
});

// Simuleer showSection-functionaliteit
function showSection(sectionId) {
  alert(`Navigeren naar sectie: ${sectionId}`);
}

// JavaScript voor notitie toevoegen
document.getElementById('addNoteButton').addEventListener('click', function() {
    const title = document.getElementById('titleInput').value.trim();
    const description = document.getElementById('descriptionInput').value.trim();
  
    if (title && description) {
      // Maak een nieuwe notitie en voeg deze toe aan de pagina
      const noteItem = document.createElement('div');
      noteItem.classList.add('note-item');
      noteItem.innerHTML = `<strong>${title}</strong>: <p>${description}</p>`;
      document.getElementById('noteDisplay').appendChild(noteItem);
  
      // Velden wissen na toevoeging
      document.getElementById('titleInput').value = '';
      document.getElementById('descriptionInput').value = '';
    } else {
      // Als de velden leeg zijn, geef een waarschuwing weer
      alert('Vul zowel de titel als de beschrijving in!');
    }
  });
  
  