// Grab references to the form and list elements
const form = document.getElementById('application-form');
const list = document.getElementById('applications-list');

// Tracks whether we're currently editing an existing entry (holds its id) or not (null)
let editingId = null;

// Function that reads localStorage and redraws the list
function renderApplications() {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    list.innerHTML = '';
    applications.forEach(function(app) {
        const li = document.createElement('li');
        // Build the fixed details (company, role, date) as plain text
        const details = document.createElement('span');
        details.textContent = `${app.company} - ${app.role} - ${app.dateApplied}`;

        // Build the status separately so we can style individually as this field is subject to change
        const statusSpan = document.createElement('span');
        statusSpan.textContent = app.status;
        statusSpan.classList.add('status-label')

        li.appendChild(details);
        li.appendChild(statusSpan)

        // create an edit button for this specific entry
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.dataset.id = app.id; // store the id on the button itself

        editBtn.addEventListener('click', function() {
            // Pre-fill the form with this application's current values
            document.getElementById('company').value = app.company;
            document.getElementById('role').value = app.role;
            document.getElementById('dateApplied').value = app.dateApplied;
            document.getElementById('status').value = app.status;

            // Remember that we're editing this specific entry
            editingId = app.id;
        });


        // create a delete button for this specific entry
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.id = app.id; // store the id on the button itself

        // when clicked, remove this application and re-render
        deleteBtn.addEventListener('click', function() {
            const applications = JSON.parse(localStorage.getItem('applications') || '[]');
            const updated = applications.filter(function(a) {
                return a.id !== app.id; // keep everything except the one matching this id
            });
        localStorage.setItem('applications', JSON.stringify(updated));
        renderApplications();
        });

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

// Run this function every time the form is submitted
form.addEventListener('submit', function(event) {
    // Stop the browser's default behaviour, which would normally reload the page on submit
    event.preventDefault();

    // Load the array once, up front - used by both the edit and add paths below
    // localStorage only stores strings, so we parse it back into a real array
    // If nothing's been saved yet (i.e. first time running), default to an empty array '[]'
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');

    if (editingId) {
        // We're editing an existing entry - find it and update its fields in place
        const appToEdit = applications.find(function(a) {
            return a.id === editingId;
        });
        appToEdit.company = document.getElementById('company').value;
        appToEdit.role = document.getElementById('role').value;
        appToEdit.dateApplied = document.getElementById('dateApplied').value;
        appToEdit.status = document.getElementById('status').value;

        editingId = null; // done editing
    } else {
        // Build an object representing this one application, using values pulled from each input
        const newApplication = {
        id: crypto.randomUUID(),                                    // generates a unique ID for this entry
        company: document.getElementById('company').value,          // text typed into the Company input
        role: document.getElementById('role').value,                // text typed into the Role input
        dateApplied: document.getElementById('dateApplied').value,   // the date picked in the date input
        status: document.getElementById('status').value              // whichever option is selected from the dropdown
        };
        // Add the new application object onto the end of that array
        applications.push(newApplication);
    }

    // Save the updated array back to localStorage
    // JSON.stringify converts the array back into a string, since that's all localStorage an hold
    localStorage.setItem('applications', JSON.stringify(applications));
    form.reset();
    renderApplications(); // redraw the list with the new array entry included
});

// Call once immediately, so saved entries show up when the page first loads
renderApplications();