const apiUrl = "http://localhost:8081/teachers";

let teachers = [];

// Load teachers when page opens
window.onload = function () {
    getTeachers();
};

// Get all teachers
function getTeachers() {

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            teachers = data;
            displayTeachers(teachers);

        })
        .catch(error => console.log(error));

}

// Display teachers
function displayTeachers(teacherList) {

    let table = "";

    teacherList.forEach(teacher => {

        table += `
        <tr>

            <td>${teacher.id}</td>

            <td>${teacher.name}</td>

            <td>${teacher.email}</td>

            <td>${teacher.department}</td>

            <td>${teacher.subject}</td>

            <td>

                <button onclick="editTeacher(${teacher.id})">
                    Edit
                </button>

                <button onclick="deleteTeacher(${teacher.id})">
                    Delete
                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("teacherTable").innerHTML = table;

}

// Add Teacher
function addTeacher() {

    const teacher = {

        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        subject: document.getElementById("subject").value

    };

    fetch(apiUrl, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(teacher)

    })

    .then(response => response.json())

    .then(() => {

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("department").value = "";
        document.getElementById("subject").value = "";

        getTeachers();

    });

}

// Delete Teacher
function deleteTeacher(id) {

    if (!confirm("Delete this teacher?")) {
        return;
    }

    fetch(apiUrl + "/" + id, {

        method: "DELETE"

    })

    .then(() => getTeachers());

}

// Edit Teacher
function editTeacher(id) {

    const teacher = teachers.find(t => t.id === id);

    const name = prompt("Teacher Name", teacher.name);
    const email = prompt("Email", teacher.email);
    const department = prompt("Department", teacher.department);
    const subject = prompt("Subject", teacher.subject);

    if (name == null || email == null || department == null || subject == null)
        return;

    fetch(apiUrl + "/" + id, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name: name,
            email: email,
            department: department,
            subject: subject

        })

    })

    .then(response => response.json())

    .then(() => getTeachers());

}

// Search Teacher
function searchTeacher() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    const filtered = teachers.filter(teacher =>

        teacher.name.toLowerCase().includes(keyword) ||

        teacher.email.toLowerCase().includes(keyword) ||

        teacher.department.toLowerCase().includes(keyword) ||

        teacher.subject.toLowerCase().includes(keyword)

    );

    displayTeachers(filtered);

}