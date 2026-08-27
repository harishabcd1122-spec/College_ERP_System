const apiUrl = "http://localhost:8081/courses";

let courses = [];

// Load courses when page opens
window.onload = function () {
    getCourses();
};

// Get all courses
function getCourses() {

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            courses = data;
            displayCourses(courses);

        })
        .catch(error => console.log(error));

}

// Display courses
function displayCourses(courseList) {

    let table = "";

    courseList.forEach(course => {

        table += `
        <tr>

            <td>${course.id}</td>

            <td>${course.courseCode}</td>

            <td>${course.courseName}</td>

            <td>${course.department}</td>

            <td>${course.teacherName}</td>

            <td>

                <button onclick="editCourse(${course.id})">
                    Edit
                </button>

                <button onclick="deleteCourse(${course.id})">
                    Delete
                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("courseTable").innerHTML = table;

}

// Add course
function addCourse() {

    const course = {

        courseCode: document.getElementById("courseCode").value,
        courseName: document.getElementById("courseName").value,
        department: document.getElementById("department").value,
        teacherName: document.getElementById("teacherName").value

    };

    fetch(apiUrl, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(course)

    })

    .then(response => response.json())

    .then(() => {

        document.getElementById("courseCode").value = "";
        document.getElementById("courseName").value = "";
        document.getElementById("department").value = "";
        document.getElementById("teacherName").value = "";

        getCourses();

    });

}

// Delete course
function deleteCourse(id) {

    if (!confirm("Delete this course?")) {
        return;
    }

    fetch(apiUrl + "/" + id, {

        method: "DELETE"

    })

    .then(() => getCourses());

}

// Edit course
function editCourse(id) {

    const course = courses.find(c => c.id === id);

    const courseCode = prompt("Course Code", course.courseCode);
    const courseName = prompt("Course Name", course.courseName);
    const department = prompt("Department", course.department);
    const teacherName = prompt("Teacher Name", course.teacherName);

    if (
        courseCode == null ||
        courseName == null ||
        department == null ||
        teacherName == null
    ) {
        return;
    }

    fetch(apiUrl + "/" + id, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            courseCode: courseCode,
            courseName: courseName,
            department: department,
            teacherName: teacherName

        })

    })

    .then(response => response.json())

    .then(() => getCourses());

}

// Search course
function searchCourse() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    const filtered = courses.filter(course =>

        course.courseCode.toLowerCase().includes(keyword) ||

        course.courseName.toLowerCase().includes(keyword) ||

        course.department.toLowerCase().includes(keyword) ||

        course.teacherName.toLowerCase().includes(keyword)

    );

    displayCourses(filtered);

}