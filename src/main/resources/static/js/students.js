const apiUrl = "http://localhost:8081/students";

let students = [];

// Load students when page opens
window.onload = function () {
    getStudents();
};

// Get all students
function getStudents() {

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            students = data;
            displayStudents(students);

        })
        .catch(error => console.log(error));

}

// Display students
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

                <button onclick="editStudent(${student.id})">
                    Edit
                </button>

                <button onclick="deleteStudent(${student.id})">
                    Delete
                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("studentTable").innerHTML = table;

}

// Add Student
function addStudent() {

    const student = {

        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value

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

    });

}

// Delete Student
function deleteStudent(id) {

    if (!confirm("Delete this student?")) {
        return;
    }

    fetch(apiUrl + "/" + id, {

        method: "DELETE"

    })

    .then(() => getStudents());

}

// Edit Student
function editStudent(id) {

    const student = students.find(s => s.id === id);

    const name = prompt("Student Name", student.name);

    const email = prompt("Email", student.email);

    const department = prompt("Department", student.department);

    if (name == null || email == null || department == null)
        return;

    fetch(apiUrl + "/" + id, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name: name,
            email: email,
            department: department

        })

    })

    .then(response => response.json())

    .then(() => getStudents());

}

// Search Student
function searchStudent() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    const filtered = students.filter(student =>

        student.name.toLowerCase().includes(keyword) ||

        student.email.toLowerCase().includes(keyword) ||

        student.department.toLowerCase().includes(keyword)

    );

    displayStudents(filtered);

}