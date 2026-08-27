function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    // Admin Login
    if (role === "admin" &&
        username === "admin" &&
        password === "admin123") {

        alert("Welcome Admin!");

        window.location.href = "dashboard.html";

        return;
    }

    // Teacher Login
    if (role === "teacher" &&
        username === "teacher" &&
        password === "teacher123") {

        alert("Welcome Teacher!");

        window.location.href = "dashboard.html";

        return;
    }

    // Student Login
    if (role === "student" &&
        username === "student" &&
        password === "student123") {

        alert("Welcome Student!");

        window.location.href = "dashboard.html";

        return;
    }

    document.getElementById("message").innerHTML =
        "Invalid Username or Password!";
}