// =========================================
// College ERP Authentication
// =========================================

// Save logged-in role
function saveRole(role) {
    localStorage.setItem("role", role.toLowerCase());
}

// Get logged-in role
function getRole() {
    return localStorage.getItem("role");
}

// Logout
function logout() {

    localStorage.removeItem("role");
    localStorage.removeItem("loggedUser");

    window.location.href = "login.html";
}

// =========================================
// Access Control
// =========================================

// Admin only
function adminOnly() {

    const role = getRole();

    if (role !== "admin") {

        alert("Access Denied!");

        window.location.href = "login.html";
    }
}

// Teacher + Admin
function staffOnly() {

    const role = getRole();

    if (role !== "admin" && role !== "teacher") {

        alert("Access Denied!");

        window.location.href = "login.html";
    }
}

// Student + Teacher + Admin
function loginRequired() {

    const role = getRole();

    if (!role) {

        alert("Please Login First");

        window.location.href = "login.html";
    }
}

// Student Page
function studentOnly() {

    const role = getRole();

    if (role !== "student") {

        alert("Access Denied!");

        window.location.href = "login.html";
    }
}

// =========================================
// Hide CRUD Buttons for Students
// =========================================

function hideStudentCrud() {

    if (getRole() === "student") {

        document.querySelectorAll(".crud-btn").forEach(btn => {

            btn.style.display = "none";

        });

    }

}

// =========================================
// Disable Form Inputs for Students
// =========================================

function disableStudentInputs() {

    if (getRole() === "student") {

        document.querySelectorAll("input").forEach(i => i.disabled = true);

        document.querySelectorAll("select").forEach(i => i.disabled = true);

        document.querySelectorAll("textarea").forEach(i => i.disabled = true);

    }

}

// =========================================
// Display Logged-in User
// =========================================

function showLoggedUser() {

    const user = JSON.parse(localStorage.getItem("loggedUser"));

    if (user && document.getElementById("loggedUser")) {

        document.getElementById("loggedUser").innerHTML =
            user.username + " (" + user.role + ")";

    }

}

// =========================================
// Page Initialization
// =========================================

