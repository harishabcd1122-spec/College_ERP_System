const apiUrl = "http://localhost:8081/students";

let students = [];

// Load all students when page loads
window.onload = function () {
    getStudents();
};

// ================= GET ALL STUDENTS =================
function getStudents() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            students = data;
            updateDashboard();
            displayStudents(students);
        })
        .catch(error => console.log(error));
}

// ================= DISPLAY STUDENTS =================
function displayStudents(studentList) {

    let table = "";

    studentList.forEach(student => {

        table += `
        <tr>

            <td>${student.id}</td>

            <td>${student.name}</td>

            <td>${student.email}</td>

            <td>${student.department}</td>

            <td>

                <button class="edit"
                onclick="editStudent(${student.id},
                '${student.name}',
                '${student.email}',
                '${student.department}')">
                Edit
                </button>

                <button class="delete"
                onclick="deleteStudent(${student.id})">
                Delete
                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("studentTable").innerHTML = table;
}

// ================= DASHBOARD =================
function updateDashboard() {

    document.getElementById("totalStudents").innerText = students.length;

    const departments = [...new Set(students.map(student => student.department))];

    document.getElementById("totalDepartments").innerText = departments.length;
}

// ================= ADD STUDENT =================
function addStudent() {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value.trim();

    if (name === "" || email === "" || department === "") {

        alert("Please fill all the fields.");

        return;
    }

    const student = {

        name: name,
        email: email,
        department: department

    };

    fetch(apiUrl, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(student)

    })

    .then(response => response.json())

    .then(() => {

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("department").value = "";

        getStudents();

    })

    .catch(error => console.log(error));

}

// ================= DELETE STUDENT =================
function deleteStudent(id) {

    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (!confirmDelete) {
        return;
    }

    fetch(apiUrl + "/" + id, {

        method: "DELETE"

    })

    .then(() => {

        getStudents();

    })

    .catch(error => console.log(error));

}

// ================= EDIT STUDENT =================
function editStudent(id, name, email, department) {

    const newName = prompt("Enter Student Name", name);

    if (newName == null) return;

    const newEmail = prompt("Enter Student Email", email);

    if (newEmail == null) return;

    const newDepartment = prompt("Enter Department", department);

    if (newDepartment == null) return;

    const student = {

        name: newName,
        email: newEmail,
        department: newDepartment

    };

    fetch(apiUrl + "/" + id, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(student)

    })

    .then(response => response.json())

    .then(() => {

        getStudents();

    })

    .catch(error => console.log(error));

}

// ================= SEARCH STUDENT =================
function searchStudent() {

    const keyword = document.getElementById("search").value.toLowerCase();

    const filteredStudents = students.filter(student =>

        student.name.toLowerCase().includes(keyword) ||

        student.email.toLowerCase().includes(keyword) ||

        student.department.toLowerCase().includes(keyword)

    );

    displayStudents(filteredStudents);

}