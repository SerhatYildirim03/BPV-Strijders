class BPVDashboard {
    constructor() {
        this.tasks = [];
        this.notifications = [];
        this.initEventListeners();
        this.loadTasks();
    }

    initEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });

        // Upload Modal
        document.getElementById('submitDocument').addEventListener('click', () => this.uploadDocument());
        document.getElementById('cancelUpload').addEventListener('click', () => this.closeUploadModal());
    }

    async loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            this.tasks = await response.json();
            this.renderTasks();
        } catch (error) {
            console.error('Taken kunnen niet worden geladen:', error);
        }
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = this.tasks.map(task => `
            <div class="task-item" data-task-id="${task.id}">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <div class="task-meta">
                    <span>Deadline: ${task.deadline}</span>
                    <span>Prioriteit: ${task.priority}</span>
                </div>
                <button class="btn btn-primary">Bekijk Details</button>
            </div>
        `).join('');
    }

    showSection(section) {
        console.log(`Toon sectie: ${section}`);
        // Implementeer logica voor secties
    }

    uploadDocument() {
        const fileInput = document.getElementById('documentInput');
        const descriptionInput = document.getElementById('descriptionInput');

        if (fileInput.files.length > 0) {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('description', descriptionInput.value);

            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                alert('Document succesvol geüpload!');
                this.closeUploadModal();
            })
            .catch(error => {
                console.error('Upload mislukt:', error);
                alert('Document upload mislukt.');
            });
        }
    }

    closeUploadModal() {
        document.getElementById('modalOverlay').style.display = 'none';
        document.getElementById('uploadModal').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BPVDashboard();
});