const API_URL = "http://localhost:8081/marks";

let marksList = [];

// Load all marks when page opens
window.onload = function () {
    loadMarks();
};

// Get all marks
function loadMarks() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            marksList = data;
            displayMarks(data);
        });
}

// Display marks in table
function displayMarks(data) {

    const table = document.getElementById("marksTable");
    table.innerHTML = "";

    data.forEach(mark => {

        table.innerHTML += `
        <tr>
            <td>${mark.id}</td>
            <td>${mark.studentName}</td>
            <td>${mark.courseName}</td>
            <td>${mark.internalMarks}</td>
            <td>${mark.externalMarks}</td>
            <td>${mark.totalMarks}</td>
            <td>${mark.grade}</td>

            <td>
                <button onclick="editMarks(${mark.id})">✏ Edit</button>
                <button onclick="deleteMarks(${mark.id})">🗑 Delete</button>
            </td>
        </tr>
        `;
    });
}

// Add Marks
function addMarks() {

    const marks = {

        studentName: document.getElementById("studentName").value,
        courseName: document.getElementById("courseName").value,
        internalMarks: parseInt(document.getElementById("internalMarks").value),
        externalMarks: parseInt(document.getElementById("externalMarks").value)

    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(marks)
    })
    .then(() => {

        document.getElementById("studentName").value = "";
        document.getElementById("courseName").value = "";
        document.getElementById("internalMarks").value = "";
        document.getElementById("externalMarks").value = "";

        loadMarks();
    });
}

// Delete Marks
function deleteMarks(id) {

    if (!confirm("Delete this record?"))
        return;

    fetch(API_URL + "/" + id, {
        method: "DELETE"
    })
    .then(() => loadMarks());

}

// Edit Marks
function editMarks(id) {

    const mark = marksList.find(m => m.id === id);

    const studentName = prompt("Student Name", mark.studentName);
    const courseName = prompt("Course Name", mark.courseName);
    const internalMarks = prompt("Internal Marks", mark.internalMarks);
    const externalMarks = prompt("External Marks", mark.externalMarks);

    if (studentName == null)
        return;

    fetch(API_URL + "/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            studentName: studentName,
            courseName: courseName,
            internalMarks: parseInt(internalMarks),
            externalMarks: parseInt(externalMarks)

        })

    })
    .then(() => loadMarks());

}

// Search
function searchMarks() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    const filtered = marksList.filter(mark =>

        mark.studentName.toLowerCase().includes(keyword) ||
        mark.courseName.toLowerCase().includes(keyword)

    );

    displayMarks(filtered);

}