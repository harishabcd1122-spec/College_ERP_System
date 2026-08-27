const apiUrl = "http://localhost:8081/attendance";

let attendanceList = [];

// Load attendance when page opens
window.onload = function () {
    getAttendance();
};

// Get all attendance
function getAttendance() {

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            attendanceList = data;
            displayAttendance(attendanceList);

        })
        .catch(error => console.log(error));

}

// Display attendance
function displayAttendance(list) {

    let table = "";

    list.forEach(attendance => {

        table += `
        <tr>

            <td>${attendance.id}</td>

            <td>${attendance.studentName}</td>

            <td>${attendance.courseName}</td>

            <td>${attendance.date}</td>

            <td>${attendance.status}</td>

            <td>

                <button onclick="editAttendance(${attendance.id})">
                    Edit
                </button>

                <button onclick="deleteAttendance(${attendance.id})">
                    Delete
                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("attendanceTable").innerHTML = table;

}

// Add attendance
function addAttendance() {

    const attendance = {

        studentName: document.getElementById("studentName").value,
        courseName: document.getElementById("courseName").value,
        date: document.getElementById("date").value,
        status: document.getElementById("status").value

    };

    fetch(apiUrl, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(attendance)

    })

    .then(response => response.json())

    .then(() => {

        document.getElementById("studentName").value = "";
        document.getElementById("courseName").value = "";
        document.getElementById("date").value = "";
        document.getElementById("status").value = "Present";

        getAttendance();

    });

}

// Delete attendance
function deleteAttendance(id) {

    if (!confirm("Delete this attendance record?")) {
        return;
    }

    fetch(apiUrl + "/" + id, {

        method: "DELETE"

    })

    .then(() => getAttendance());

}

// Edit attendance
function editAttendance(id) {

    const attendance = attendanceList.find(a => a.id === id);

    const studentName = prompt("Student Name", attendance.studentName);
    const courseName = prompt("Course Name", attendance.courseName);
    const date = prompt("Date (YYYY-MM-DD)", attendance.date);
    const status = prompt("Status (Present/Absent)", attendance.status);

    if (
        studentName == null ||
        courseName == null ||
        date == null ||
        status == null
    ) {
        return;
    }

    fetch(apiUrl + "/" + id, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            studentName: studentName,
            courseName: courseName,
            date: date,
            status: status

        })

    })

    .then(response => response.json())

    .then(() => getAttendance());

}

// Search attendance
function searchAttendance() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    const filtered = attendanceList.filter(attendance =>

        attendance.studentName.toLowerCase().includes(keyword) ||

        attendance.courseName.toLowerCase().includes(keyword) ||

        attendance.status.toLowerCase().includes(keyword) ||

        attendance.date.toLowerCase().includes(keyword)

    );

    displayAttendance(filtered);

}