const apiUrl = "http://localhost:8081/dashboard";

window.onload = function () {

    loadDashboard();
    loadDepartmentCharts();
    loadLowAttendance();

};

// ================= Dashboard Cards =================

function loadDashboard() {

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            document.getElementById("studentCount").innerHTML = data.students;
            document.getElementById("teacherCount").innerHTML = data.teachers;
            document.getElementById("courseCount").innerHTML = data.courses;
            document.getElementById("attendanceCount").innerHTML = data.attendance;

            if(document.getElementById("topScorer"))
                document.getElementById("topScorer").innerHTML = data.topScorer;

            if(document.getElementById("highestMarks"))
                document.getElementById("highestMarks").innerHTML =
                    data.highestMarks + " Marks";

        })
        .catch(error => console.log(error));

}


// ================= Department Charts =================

function loadDepartmentCharts() {

    fetch(apiUrl + "/departments")
        .then(response => response.json())
        .then(data => {

            const labels = Object.keys(data);
            const values = Object.values(data);

            // Bar Chart

            new Chart(document.getElementById("studentChart"), {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [{

                        label: "Students",

                        data: values,

                        backgroundColor: [
                            "#0d6efd",
                            "#198754",
                            "#ffc107",
                            "#dc3545",
                            "#6f42c1",
                            "#20c997",
                            "#fd7e14"
                        ]

                    }]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {
                            display: false
                        }

                    }

                }

            });


            // Pie Chart

            new Chart(document.getElementById("pieChart"), {

                type: "pie",

                data: {

                    labels: labels,

                    datasets: [{

                        data: values,

                        backgroundColor: [
                            "#0d6efd",
                            "#198754",
                            "#ffc107",
                            "#dc3545",
                            "#6f42c1",
                            "#20c997",
                            "#fd7e14"
                        ]

                    }]

                },

                options: {

                    responsive: true

                }

            });

        })

        .catch(error => console.log(error));

}



// ================= Low Attendance =================

function loadLowAttendance() {

    fetch("http://localhost:8081/attendance/low-attendance")

        .then(response => response.json())

        .then(data => {

            let rows = "";

            if (data.length === 0) {

                rows = `
                <tr>
                    <td colspan="2" class="text-center">
                        ✅ No students below 75%
                    </td>
                </tr>`;
            }
            else {

                data.forEach(student => {

                    rows += `
                    <tr>
                        <td>${student[0]}</td>
                        <td>
                            <span class="badge bg-danger">
                                ${student[1]}%
                            </span>
                        </td>
                    </tr>`;

                });

            }

            document.getElementById("lowAttendanceTable").innerHTML = rows;

        })

        .catch(error => console.log(error));

}