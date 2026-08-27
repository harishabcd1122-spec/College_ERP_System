/**
 * Register Page Controller
 * Task Management System
 */

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const registerBtn = document.getElementById('registerBtn');
  const alertBox = document.getElementById('alertBox');

  /**
   * Display alert message
   * @param {string} message - Message text
   * @param {'success'|'danger'} type - Alert style type
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
   * Hide alert message
   */
  const hideAlert = () => {
    if (alertBox) {
      alertBox.style.display = 'none';
      alertBox.innerHTML = '';
    }
  };

  /**
   * Validate email format
   * @param {string} email
   * @returns {boolean}
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email).toLowerCase());
  };

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      // 1. Basic field presence checks
      if (!name || !email || !password || !confirmPassword) {
        showAlert('Please fill in all required fields.', 'danger');
        return;
      }

      // 2. Email format validation
      if (!validateEmail(email)) {
        showAlert('Please enter a valid email address (e.g. name@example.com).', 'danger');
        return;
      }

      // 3. Password length check
      if (password.length < 6) {
        showAlert('Password must be at least 6 characters long.', 'danger');
        return;
      }

      // 4. Password confirmation match
      if (password !== confirmPassword) {
        showAlert('Passwords do not match. Please verify and try again.', 'danger');
        return;
      }

      // Disable button and show loading state
      const originalBtnHtml = registerBtn.innerHTML;
      registerBtn.disabled = true;
      registerBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';

      try {
        const response = await fetch('http://localhost:8080/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password
          })
        });

        if (response.ok) {
          showAlert('Registration successful! Redirecting to login...', 'success');
          registerForm.reset();
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1800);
        } else {
          let errorMsg = 'Registration failed. Please try again.';
          try {
            const data = await response.json();
            if (data && data.message && typeof data.message === 'string') {
              // Use the specific message returned by our backend (400 / 409 / etc.)
              errorMsg = data.message;
            } else if (response.status === 409) {
              errorMsg = 'This email is already registered. Please sign in or use another email.';
            } else if (response.status === 400) {
              errorMsg = 'Invalid registration data. Please fill in all required fields.';
            }
          } catch (err) {
            // Response was not JSON — keep the generic message
            if (response.status === 409) {
              errorMsg = 'This email is already registered. Please sign in or use another email.';
            }
          }

          showAlert(errorMsg, 'danger');
        }
      } catch (error) {
        showAlert('Unable to connect to the backend server. Please verify the application is running.', 'danger');
      } finally {
        registerBtn.disabled = false;
        registerBtn.innerHTML = originalBtnHtml;
      }
    });
  }
});
