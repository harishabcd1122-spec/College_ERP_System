/**
 * Login Page Controller
 * Task Management System
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const alertBox = document.getElementById('alertBox');

  /**
   * Display an alert message in the alert box.
   * @param {string} message - The message to display.
   * @param {'success'|'danger'} type - The alert style.
   */
  const showAlert = (message, type = 'danger') => {
    if (!alertBox) return;
    alertBox.className = `alert-box alert-${type}`;
    alertBox.innerHTML = type === 'success'
      ? `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`
      : `<i class="fa-solid fa-triangle-exclamation"></i> <span>${message}</span>`;
    alertBox.style.display = 'flex';
  };

  /**
   * Hide the alert box.
   */
  const hideAlert = () => {
    if (alertBox) {
      alertBox.style.display = 'none';
      alertBox.innerHTML = '';
    }
  };

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      // Basic field presence checks
      if (!email || !password) {
        showAlert('Please enter your email and password.', 'danger');
        return;
      }

      // Disable button and show loading state
      const originalBtnHtml = loginBtn.innerHTML;
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';

      try {
        const response = await fetch('http://localhost:8080/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });

        if (response.ok) {
          const user = await response.json();

          // Store only safe user info — NEVER store the password
          sessionStorage.setItem('userId', user.id);
          sessionStorage.setItem('userName', user.name);
          sessionStorage.setItem('userEmail', user.email);

          showAlert('Login successful! Redirecting...', 'success');

          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 800);

        } else {
          // 401 Unauthorized or any other failure
          showAlert('Invalid email or password. Please try again.', 'danger');
        }

      } catch (error) {
        showAlert('Unable to connect to the server. Please ensure the application is running.', 'danger');
      } finally {
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalBtnHtml;
      }
    });
  }
});
