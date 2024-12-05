const taken = [
    {
        titel: 'Ontwerp maken voor eindproject',
        beschrijving: 'Maak een gedetailleerd ontwerp voor het BPV eindproject inclusief wireframes en gebruikersstromen',
        deadline: '2024-12-01',
        prioriteit: 'high',
        status: 'nog niet gestart',
        voltooid: false,
        voltooidDatum: null,
        herinneringen: []
    },
    {
        titel: 'Database implementatie voorbereiden',
        beschrijving: 'Bereid de databasestructuur voor en maak een ERD-diagram voor het projectsysteem',
        deadline: '2024-11-25',
        prioriteit: 'medium',
        status: 'nog niet gestart',
        voltooid: false,
        voltooidDatum: null,
        herinneringen: []
    },
    {
        titel: 'Weekverslag schrijven',
        beschrijving: 'Schrijf een gedetailleerd verslag over de voortgang van afgelopen week',
        deadline: '2024-11-20',
        prioriteit: 'low',
        status: 'nog niet gestart',
        voltooid: false,
        voltooidDatum: null,
        herinneringen: []
    }
];

const meldingen = [];

function addDeadlineNotification(taak) {
    const tijdTotDeadline = new Date(taak.deadline) - new Date();
    const dagenTotDeadline = Math.ceil(tijdTotDeadline / (1000 * 60 * 60 * 24));

    if (dagenTotDeadline === 3) {
        meldingen.push({
            titel: 'Naderende Deadline',
            bericht: `Let op: De deadline voor "${taak.titel}" is over 3 dagen`,
            tijd: 'Net toegevoegd',
            taakIndex: taken.indexOf(taak) // Toevoegen van de taak index
        });
    } else if (dagenTotDeadline === 1) {
        meldingen.push({
            titel: 'Naderende Deadline',
            bericht: `Let op: De deadline voor "${taak.titel}" is morgen`,
            tijd: 'Net toegevoegd',
            taakIndex: taken.indexOf(taak) // Toevoegen van de taak index
        });
    }
}

function checkDeadlines() {
    taken.forEach(addDeadlineNotification);
    taken.forEach(task => {
        if (task.prioriteit === 'high' && !task.voltooid) {
            addImportantNotification(task, 'Belangrijke Taak', `De taak "${task.titel}" heeft een hoge prioriteit.`);
        }
    });
}

function addImportantNotification(task, titel, bericht) {
    meldingen.push({
        titel: titel,
        bericht: bericht,
        tijd: 'Net toegevoegd',
        taakIndex: taken.indexOf(task) // Toevoegen van de taak index
    });
    renderMeldingen();
}

function renderTaken() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = taken.filter(taak => !taak.voltooid).map((taak, index) => `
        <div class="task-item">
            <div class="task-header">
                <h3>${taak.titel}</h3>
                <span class="priority-badge priority-${taak.prioriteit}">
                    ${taak.prioriteit === 'high' ? 'Hoge prioriteit' : 
                    taak.prioriteit === 'medium' ? 'Gemiddelde prioriteit' : 
                    'Lage prioriteit'}
                </span>
                <span class="reminder-icon" onclick="toggleReminder(${index})">
                    ${taak.herinneringen.length > 0 ? '🔔' : '🔕'}
                </span>
            </div>
            <p>${taak.beschrijving}</p>
            <div class="task-meta">
                <span>📅 Deadline: ${taak.deadline}</span>
                <span>📊 Status: ${taak.status}</span>
            </div>
            <button class="btn" onclick="startTaak(${index})" ${taak.voltooid ? 'disabled' : ''}>
                ${taak.voltooid ? 'Taak Voltooid' : 'Start Taak'}
            </button>
            ${taak.status === 'in behandeling' ? `<button class="btn" onclick="pauseTaak(${index})">Pauze</button>` : ''}
            <button class="btn" onclick="openUploadPopup(${index})">Inleveren</button>
            <div class="reminder-form" id="reminderForm-${index}">
                <input type="datetime-local" id="reminderDate-${index}" />
                <button class="btn" onclick="setReminder(${index})">Stel Herinnering In</button>
            </div>
            <div class="reminder-list" id="reminderList-${index}">
                ${taak.herinneringen.map((rem, reminderIndex) => `
                    <div>
                        ${rem.tijd} 
                        <button class="btn" onclick="removeReminder(${index}, ${reminderIndex})">Verwijder</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function startTaak(index) {
    const taak = taken[index];
    taak.status = 'bezig';
    renderTaken();
}

function pauseTaak(index) {
    const taak = taken[index];
    taak.status = 'gepauzeerd';
    renderTaken();
}

function toggleReminder(index) {
    const form = document.getElementById(`reminderForm-${index}`);
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
}

function setReminder(index) {
    const reminderDateInput = document.getElementById(`reminderDate-${index}`);
    const reminderDate = new Date(reminderDateInput.value);

    if (reminderDate && reminderDate > new Date()) {
        taken[index].herinneringen.push({ tijd: reminderDate.toLocaleString() });

        // Vraag of de taak ook bij belangrijke meldingen moet komen
        const isImportant = confirm(`Wil je de taak "${taken[index].titel}" ook bij de belangrijke meldingen zetten?`);
        if (isImportant) {
            addImportantNotification(taken[index], 'Belangrijke Herinnering', `Herinnering ingesteld voor de taak "${taken[index].titel}".`);
        }

        reminderDateInput.value = ''; // Reset het invoerveld
        renderTaken(); // Herteken de taken
    } else {
        alert('Voer een geldige datum en tijd in.');
    }
}

function removeReminder(taskIndex, reminderIndex) {
    // Verwijder de herinnering van de taak
    taken[taskIndex].herinneringen.splice(reminderIndex, 1);

    // Verwijder de bijbehorende melding
    meldingen.forEach((melding, index) => {
        if (melding.taakIndex === taskIndex && melding.bericht.includes(taken[taskIndex].titel)) {
            meldingen.splice(index, 1);
        }
    });

    renderMeldingen(); // Herteken de meldingen na het verwijderen
    renderTaken(); // Herteken de taken na het verwijderen
}

function renderMeldingen() {
    const notificationList = document.getElementById('notificationList');
    notificationList.innerHTML = meldingen.map(melding => `
        <div class="notification-item">
            <strong>${melding.titel}</strong>
            <p>${melding.bericht}</p>
            <div class="notification-time">${melding.tijd}</div>
        </div>
    `).join('');
}

// Functie om de herinneringen te controleren en af te spelen als de tijd is bereikt
function checkReminders() {
    const now = new Date();

    taken.forEach((taak, taskIndex) => {
        taak.herinneringen.forEach((reminder, reminderIndex) => {
            const reminderTime = new Date(reminder.tijd);

            console.log("Herinneringstijd: ", reminderTime, " Huidige tijd: ", now); // Logging toegevoegd

            if (reminderTime <= now) {
                // Log een bericht om te controleren wanneer de tijd wordt bereikt
                console.log("Herinneringstijd bereikt, afspelen van geluid.");

                // Speel de notificatie geluid af
                const audio = document.getElementById('notificationSound');
                
                // Zorg ervoor dat de audio wordt afgespeeld
                audio.play().catch(err => {
                    console.log("Audio werd geblokkeerd, probeer handmatig af te spelen:", err);
                });

                // Verwijder de herinnering nadat de tijd is bereikt
                removeReminder(taskIndex, reminderIndex);
            }
        });
    });
}

// Verhoog de frequentie van de herinnering controle
document.addEventListener('DOMContentLoaded', () => {
    checkDeadlines(); // Controleer voor deadlines bij laden
    renderTaken();
    renderMeldingen(); // Render meldingen bij het laden

    // Interval om elke minuut opnieuw te controleren op herinneringen
    setInterval(() => {
        checkReminders(); // Controleer herinneringen
        checkDeadlines();
        renderTaken();
    }, 60000); // Controleer elk minuut
});
