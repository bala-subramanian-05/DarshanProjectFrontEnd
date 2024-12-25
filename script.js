// DOM Elements
const dashboardSection = document.getElementById('dashboard');
const addEmployeeSection = document.getElementById('addEmployee');
const dashboardBtn = document.getElementById('dashboardBtn');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const employeeForm = document.getElementById('employeeForm');
const employeeTableBody = document.querySelector('#employeeTable tbody');
const submitButton = employeeForm.querySelector('button[type="submit"]');

// State to track editing
let editingEmployeeId = null;

// Switch Sections
dashboardBtn.addEventListener('click', () => switchSection('dashboard'));
addEmployeeBtn.addEventListener('click', () => {
    resetForm();
    switchSection('addEmployee');
});

function switchSection(sectionId) {
    document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Fetch Employees
function fetchEmployees() {
    fetch('http://localhost:8080/api/v1/employee') // Replace with your API endpoint
        .then(response => response.json())
        .then(data => {
            employeeTableBody.innerHTML = ''; // Clear previous data
            data.forEach(employee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee.id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.email}</td>
                    <td>${employee.department}</td>
                    <td>${employee.role}</td>
                    <td>${employee.salary}</td>
                    <td>
                        <button class="btn-edit" onclick="editEmployee(${employee.id})">Edit</button>
                        <button class="btn-delete" onclick="deleteEmployee(${employee.id})">Delete</button>
                    </td>
                `;
                employeeTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching employees:', error));
}

// Add or Edit Employee
employeeForm.addEventListener('submit', event => {
    event.preventDefault();

    const employeeData = {
        id:document.getElementById('empId').value,
        name: document.getElementById('empName').value,
        email: document.getElementById('empEmail').value,
        department: document.getElementById('empDept').value,
        role:document.getElementById('empRole').value,
        salary: document.getElementById('empSalary').value,
    };

    const endpoint = editingEmployeeId
        ? `http://localhost:8080/api/v1/employee/${editingEmployeeId}`
        : 'http://localhost:8080/api/v1/employee';

    const method = editingEmployeeId ? 'PUT' : 'POST';

    fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
    })
        .then(response => {
            if (response.ok) {
                const action = editingEmployeeId ? 'updated' : 'added';
                alert(`Employee successfully ${action}!`);
                fetchEmployees();
                switchSection('dashboard');
                resetForm();
            } else {
                alert('Failed to save employee data');
            }
        })
        .catch(error => console.error('Error saving employee data:', error));
});

// Edit Employee
function editEmployee(id) {
    fetch(`http://localhost:8080/api/v1/employee/${id}`) // Replace with your API endpoint
        .then(response => response.json())
        .then(employee => {
            document.getElementById('empId').value=employee.id;
            document.getElementById('empName').value = employee.name;
            document.getElementById('empEmail').value = employee.email;
            document.getElementById('empDept').value = employee.department;
            document.getElementById('empRole').value=employee.role;
            document.getElementById('empSalary').value = employee.salary;

            editingEmployeeId = id; // Set editing state
            submitButton.textContent = 'Update Employee'; // Update button text
            switchSection('addEmployee');
        })
        .catch(error => console.error('Error fetching employee for edit:', error));
}

// Delete Employee
function deleteEmployee(id) {
    fetch(`http://localhost:8080/api/v1/employee/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                alert('Employee deleted successfully!');
                fetchEmployees();
            } else {
                alert('Failed to delete employee');
            }
        })
        .catch(error => console.error('Error deleting employee:', error));
}

// Reset Form
function resetForm() {
    employeeForm.reset();
    editingEmployeeId = null;
    submitButton.textContent = 'Add Employee'; // Reset button text
}

// Initial Fetch
fetchEmployees();
