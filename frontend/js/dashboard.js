/**
 * Dashboard Page Controller
 * Task Management System
 * Built with Vanilla JavaScript & REST API Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. Authentication & Session Verification
  // ---------------------------------------------------------------------------
  const userId = sessionStorage.getItem('userId') || sessionStorage.getItem('id');
  const userName = sessionStorage.getItem('userName') || sessionStorage.getItem('name');
  const userEmail = sessionStorage.getItem('userEmail') || sessionStorage.getItem('email');

  // If no logged-in user exists, redirect immediately to login page
  if (!userId) {
    window.location.replace('login.html');
    return;
  }

  // Display user's name and email in the top navigation badge
  const userNameEl = document.getElementById('userName');
  const userBadgeEl = document.getElementById('userBadge');
  if (userNameEl) {
    userNameEl.textContent = userName || 'User';
  }
  if (userBadgeEl && userEmail) {
    userBadgeEl.setAttribute('title', `Logged in as: ${userEmail}`);
  }

  // ---------------------------------------------------------------------------
  // 2. DOM Elements
  // ---------------------------------------------------------------------------
  const logoutBtn = document.getElementById('logoutBtn');
  const openAddTaskModalBtn = document.getElementById('openAddTaskModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const taskModal = document.getElementById('taskModal');
  const taskForm = document.getElementById('taskForm');
  const modalTitle = document.getElementById('modalTitle');
  const saveTaskBtn = document.getElementById('saveTaskBtn');
  const modalAlert = document.getElementById('modalAlert');
  const dashboardAlert = document.getElementById('dashboardAlert');

  const taskIdInput = document.getElementById('taskId');
  const taskTitleInput = document.getElementById('taskTitle');
  const taskDescriptionInput = document.getElementById('taskDescription');
  const taskPrioritySelect = document.getElementById('taskPriority');
  const taskStatusSelect = document.getElementById('taskStatus');
  const taskDueDateInput = document.getElementById('taskDueDate');

  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const priorityFilter = document.getElementById('priorityFilter');
  const taskContainer = document.getElementById('taskContainer');

  const totalTasksCountEl = document.getElementById('totalTasksCount');
  const todoTasksCountEl = document.getElementById('todoTasksCount');
  const progressTasksCountEl = document.getElementById('progressTasksCount');
  const completedTasksCountEl = document.getElementById('completedTasksCount');

  // API Base Endpoints
  const API_TASKS_URL = 'http://localhost:8080/api/tasks';

  // State Management
  let allTasks = [];
  let alertTimeout = null;

  // ---------------------------------------------------------------------------
  // 3. Helper Functions (Alerts, Escaping, Formatting)
  // ---------------------------------------------------------------------------

  /**
   * Escape HTML strings to prevent Cross-Site Scripting (XSS).
   */
  const escapeHtml = (unsafe) => {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  /**
   * Format ISO date (YYYY-MM-DD) into user-friendly text (e.g., Aug 25, 2026).
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        }
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  /**
   * Display dashboard-level feedback alert banner.
   */
  const showDashboardAlert = (message, type = 'success', duration = 3500) => {
    if (!dashboardAlert) return;
    if (alertTimeout) clearTimeout(alertTimeout);

    dashboardAlert.className = `alert-box alert-${type}`;
    dashboardAlert.innerHTML = type === 'success'
      ? `<i class="fa-solid fa-circle-check"></i> <span>${escapeHtml(message)}</span>`
      : `<i class="fa-solid fa-triangle-exclamation"></i> <span>${escapeHtml(message)}</span>`;
    dashboardAlert.style.display = 'flex';

    alertTimeout = setTimeout(() => {
      dashboardAlert.style.display = 'none';
      dashboardAlert.innerHTML = '';
    }, duration);
  };

  /**
   * Display modal-level alert banner.
   */
  const showModalAlert = (message, type = 'danger') => {
    if (!modalAlert) return;
    modalAlert.className = `alert-box alert-${type}`;
    modalAlert.innerHTML = type === 'success'
      ? `<i class="fa-solid fa-circle-check"></i> <span>${escapeHtml(message)}</span>`
      : `<i class="fa-solid fa-triangle-exclamation"></i> <span>${escapeHtml(message)}</span>`;
    modalAlert.style.display = 'flex';
  };

  const hideModalAlert = () => {
    if (modalAlert) {
      modalAlert.style.display = 'none';
      modalAlert.innerHTML = '';
    }
  };

  /**
   * Get CSS badge class for task priority.
   */
  const getPriorityBadgeClass = (priority) => {
    const p = (priority || '').toUpperCase();
    if (p === 'HIGH') return 'badge-high';
    if (p === 'LOW') return 'badge-low';
    return 'badge-medium';
  };

  /**
   * Format priority text for display.
   */
  const formatPriority = (priority) => {
    const p = (priority || 'MEDIUM').toUpperCase();
    if (p === 'HIGH') return 'High';
    if (p === 'LOW') return 'Low';
    return 'Medium';
  };

  /**
   * Get CSS badge class for task status.
   */
  const getStatusBadgeClass = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'COMPLETED') return 'badge-completed';
    if (s === 'IN_PROGRESS') return 'badge-progress';
    return 'badge-todo';
  };

  /**
   * Format status text for display.
   */
  const formatStatus = (status) => {
    const s = (status || 'TODO').toUpperCase();
    if (s === 'COMPLETED') return 'Completed';
    if (s === 'IN_PROGRESS') return 'In Progress';
    return 'To Do';
  };

  // ---------------------------------------------------------------------------
  // 4. Statistics Calculation
  // ---------------------------------------------------------------------------
  const updateStatistics = (tasks) => {
    const total = tasks.length;
    let todoCount = 0;
    let progressCount = 0;
    let completedCount = 0;

    tasks.forEach(task => {
      const status = (task.status || '').toUpperCase();
      if (status === 'TODO') {
        todoCount++;
      } else if (status === 'IN_PROGRESS') {
        progressCount++;
      } else if (status === 'COMPLETED') {
        completedCount++;
      }
    });

    if (totalTasksCountEl) totalTasksCountEl.textContent = total;
    if (todoTasksCountEl) todoTasksCountEl.textContent = todoCount;
    if (progressTasksCountEl) progressTasksCountEl.textContent = progressCount;
    if (completedTasksCountEl) completedTasksCountEl.textContent = completedCount;
  };

  // ---------------------------------------------------------------------------
  // 5. Render Tasks (With Search & Filter Support)
  // ---------------------------------------------------------------------------
  const renderFilteredTasks = () => {
    if (!taskContainer) return;

    const searchQuery = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const selectedStatus = (statusFilter ? statusFilter.value : 'ALL').toUpperCase();
    const selectedPriority = (priorityFilter ? priorityFilter.value : 'ALL').toUpperCase();

    // Filter tasks based on search, status, and priority
    const filtered = allTasks.filter(task => {
      // Status match
      const taskStatus = (task.status || '').toUpperCase();
      const statusMatches = selectedStatus === 'ALL' || taskStatus === selectedStatus;

      // Priority match
      const taskPriority = (task.priority || '').toUpperCase();
      const priorityMatches = selectedPriority === 'ALL' || taskPriority === selectedPriority;

      // Search match (title and description)
      const taskTitle = (task.title || '').toLowerCase();
      const taskDesc = (task.description || '').toLowerCase();
      const searchMatches = !searchQuery || taskTitle.includes(searchQuery) || taskDesc.includes(searchQuery);

      return statusMatches && priorityMatches && searchMatches;
    });

    // 13. Empty states
    if (allTasks.length === 0) {
      // User has no tasks at all
      taskContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fa-regular fa-folder-open"></i>
          </div>
          <h3 class="empty-state-title">No tasks yet</h3>
          <p class="empty-state-text">You haven't created any tasks yet. Start organizing your projects today!</p>
          <button type="button" id="emptyStateAddBtn" class="btn btn-primary">
            <i class="fa-solid fa-plus"></i> Add Task
          </button>
        </div>
      `;

      const emptyBtn = document.getElementById('emptyStateAddBtn');
      if (emptyBtn) {
        emptyBtn.addEventListener('click', openAddTaskModal);
      }
      return;
    }

    if (filtered.length === 0) {
      // User has tasks, but none match current filters
      taskContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fa-solid fa-filter-circle-xmark"></i>
          </div>
          <h3 class="empty-state-title">No matching tasks found</h3>
          <p class="empty-state-text">Try adjusting or clearing your search and filter criteria.</p>
          <button type="button" id="clearFiltersBtn" class="btn btn-secondary">
            <i class="fa-solid fa-rotate-left"></i> Reset Filters
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('clearFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          if (statusFilter) statusFilter.value = 'ALL';
          if (priorityFilter) priorityFilter.value = 'ALL';
          renderFilteredTasks();
        });
      }
      return;
    }

    // Render task cards dynamically
    taskContainer.innerHTML = filtered.map(task => `
      <div class="task-card" data-task-id="${task.id}">
        <div class="task-card-header">
          <h3 class="task-title">${escapeHtml(task.title)}</h3>
          <div class="task-badges">
            <span class="badge ${getPriorityBadgeClass(task.priority)}">${formatPriority(task.priority)}</span>
            <span class="badge ${getStatusBadgeClass(task.status)}">${formatStatus(task.status)}</span>
          </div>
        </div>
        <p class="task-desc">${escapeHtml(task.description || 'No description provided.')}</p>
        <div class="task-meta">
          <span class="task-due-date" title="Due Date">
            <i class="fa-regular fa-calendar"></i>
            <span>${formatDate(task.dueDate)}</span>
          </span>
          <div class="task-actions">
            <button type="button" class="btn btn-secondary btn-sm edit-task-btn" data-id="${task.id}" title="Edit Task">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button type="button" class="btn btn-secondary btn-sm delete-task-btn" data-id="${task.id}" title="Delete Task" style="color: #FB7185; border-color: rgba(251, 113, 133, 0.35);">
              <i class="fa-solid fa-trash-can"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach event listeners to Edit and Delete buttons on each card
    taskContainer.querySelectorAll('.edit-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        const taskToEdit = allTasks.find(t => t.id === id);
        if (taskToEdit) {
          openEditTaskModal(taskToEdit);
        }
      });
    });

    taskContainer.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        handleDeleteTask(id);
      });
    });
  };

  // ---------------------------------------------------------------------------
  // 6. Fetch Tasks from Backend API
  // ---------------------------------------------------------------------------
  const loadUserTasks = async () => {
    if (!taskContainer) return;

    // Show professional loading spinner state
    taskContainer.innerHTML = `
      <div class="empty-state" style="border-style: solid; border-color: rgba(168, 85, 199, 0.25);">
        <div class="empty-state-icon">
          <i class="fa-solid fa-spinner fa-spin" style="color: var(--pink-glow);"></i>
        </div>
        <h3 class="empty-state-title">Loading your tasks...</h3>
        <p class="empty-state-text">Fetching the latest task list from the server.</p>
      </div>
    `;

    try {
      const response = await fetch(`${API_TASKS_URL}/user/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const tasks = await response.json();
      allTasks = Array.isArray(tasks) ? tasks : [];
      updateStatistics(allTasks);
      renderFilteredTasks();

    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      // Graceful error state that doesn't break dashboard
      taskContainer.innerHTML = `
        <div class="empty-state" style="border-color: rgba(251, 113, 133, 0.45);">
          <div class="empty-state-icon" style="color: #FB7185;">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h3 class="empty-state-title">Failed to load tasks</h3>
          <p class="empty-state-text">Unable to connect to the backend server. Please verify the application is running.</p>
          <button type="button" id="retryFetchBtn" class="btn btn-secondary" style="margin-top: 0.5rem;">
            <i class="fa-solid fa-rotate-right"></i> Retry
          </button>
        </div>
      `;

      const retryBtn = document.getElementById('retryFetchBtn');
      if (retryBtn) {
        retryBtn.addEventListener('click', loadUserTasks);
      }
    }
  };

  // ---------------------------------------------------------------------------
  // 7. Modal Handlers (Open, Edit, Close)
  // ---------------------------------------------------------------------------
  const openAddTaskModal = () => {
    if (!taskModal || !taskForm) return;
    taskForm.reset();
    hideModalAlert();
    if (taskIdInput) taskIdInput.value = '';
    if (modalTitle) modalTitle.textContent = 'Add New Task';
    if (taskPrioritySelect) taskPrioritySelect.value = 'MEDIUM';
    if (taskStatusSelect) taskStatusSelect.value = 'TODO';
    if (saveTaskBtn) saveTaskBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Create Task';
    taskModal.classList.add('active');
    if (taskTitleInput) taskTitleInput.focus();
  };

  const openEditTaskModal = (task) => {
    if (!taskModal || !taskForm) return;
    hideModalAlert();
    if (taskIdInput) taskIdInput.value = task.id;
    if (modalTitle) modalTitle.textContent = 'Edit Task';
    if (taskTitleInput) taskTitleInput.value = task.title || '';
    if (taskDescriptionInput) taskDescriptionInput.value = task.description || '';
    if (taskPrioritySelect) taskPrioritySelect.value = (task.priority || 'MEDIUM').toUpperCase();
    if (taskStatusSelect) taskStatusSelect.value = (task.status || 'TODO').toUpperCase();
    if (taskDueDateInput) taskDueDateInput.value = task.dueDate || '';
    if (saveTaskBtn) saveTaskBtn.innerHTML = '<i class="fa-solid fa-check"></i> Update Task';
    taskModal.classList.add('active');
    if (taskTitleInput) taskTitleInput.focus();
  };

  const closeModal = () => {
    if (taskModal) {
      taskModal.classList.remove('active');
      hideModalAlert();
    }
  };

  if (openAddTaskModalBtn) openAddTaskModalBtn.addEventListener('click', openAddTaskModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

  // Close modal when clicking on backdrop
  if (taskModal) {
    taskModal.addEventListener('click', (e) => {
      if (e.target === taskModal) {
        closeModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && taskModal && taskModal.classList.contains('active')) {
      closeModal();
    }
  });

  // ---------------------------------------------------------------------------
  // 8. Add & Edit Task Form Submission
  // ---------------------------------------------------------------------------
  if (taskForm) {
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideModalAlert();

      const activeUserId = sessionStorage.getItem('userId') || sessionStorage.getItem('id') || userId;
      if (!activeUserId) {
        showModalAlert('User session not found. Please log in again.', 'danger');
        return;
      }

      const title = taskTitleInput ? taskTitleInput.value.trim() : '';
      const description = taskDescriptionInput ? taskDescriptionInput.value.trim() : '';
      const priority = taskPrioritySelect ? taskPrioritySelect.value : 'MEDIUM';
      const status = taskStatusSelect ? taskStatusSelect.value : 'TODO';
      const dueDateVal = taskDueDateInput ? taskDueDateInput.value : '';
      const taskId = taskIdInput ? taskIdInput.value : '';

      if (!title) {
        showModalAlert('Task title is required.', 'danger');
        return;
      }

      // Construct payload according to backend entity specification
      const taskData = {
        title: title,
        description: description,
        priority: priority,
        status: status,
        dueDate: dueDateVal ? dueDateVal : null,
        user: {
          id: Number(activeUserId)
        }
      };

      const isEditing = Boolean(taskId);
      const url = isEditing ? `${API_TASKS_URL}/${taskId}` : API_TASKS_URL;
      const method = isEditing ? 'PUT' : 'POST';

      // Show loading spinner on button
      const originalBtnHtml = saveTaskBtn.innerHTML;
      saveTaskBtn.disabled = true;
      saveTaskBtn.innerHTML = isEditing
        ? '<i class="fa-solid fa-spinner fa-spin"></i> Updating...'
        : '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(taskData)
        });

        if (!response.ok) {
          let errorMsg = `Server returned HTTP ${response.status}`;
          try {
            const errData = await response.json();
            if (errData && (errData.message || errData.error)) {
              errorMsg = errData.message || errData.error;
            }
          } catch (jsonErr) {
            // response was not json
          }
          throw new Error(errorMsg);
        }

        // Close modal, show success alert, and refresh task list & statistics
        closeModal();
        showDashboardAlert(
          isEditing ? 'Task updated successfully!' : 'New task created successfully!',
          'success'
        );
        await loadUserTasks();

      } catch (error) {
        console.error('Error saving task:', error);
        showModalAlert(
          `Unable to save task: ${error.message || 'Please check your connection.'}`,
          'danger'
        );
      } finally {
        saveTaskBtn.disabled = false;
        saveTaskBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 9. Delete Task Handler
  // ---------------------------------------------------------------------------
  const handleDeleteTask = async (id) => {
    if (!id) return;
    const taskToDelete = allTasks.find(t => t.id === id);
    const taskName = taskToDelete ? `"${taskToDelete.title}"` : 'this task';

    const confirmed = window.confirm(`Are you sure you want to delete ${taskName}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_TASKS_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      showDashboardAlert('Task deleted successfully.', 'success');
      await loadUserTasks();

    } catch (error) {
      console.error('Error deleting task:', error);
      showDashboardAlert('Failed to delete task. Please try again.', 'danger');
    }
  };

  // ---------------------------------------------------------------------------
  // 10. Search & Filter Event Listeners
  // ---------------------------------------------------------------------------
  if (searchInput) {
    searchInput.addEventListener('input', renderFilteredTasks);
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', renderFilteredTasks);
  }

  if (priorityFilter) {
    priorityFilter.addEventListener('change', renderFilteredTasks);
  }

  // ---------------------------------------------------------------------------
  // 11. Logout Handler
  // ---------------------------------------------------------------------------
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // Clear all session storage securely
      sessionStorage.clear();
      window.location.href = 'login.html';
    });
  }

  // ---------------------------------------------------------------------------
  // 12. Initial Load
  // ---------------------------------------------------------------------------
  loadUserTasks();
});
