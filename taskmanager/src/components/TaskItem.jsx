import { useState } from "react";
import TaskForm from "./TaskForm";

// Priority config
const PRIORITY = {
  high: {
    label: "High",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  },
  medium: {
    label: "Medium",
    dot: "bg-yellow-500",
    badge:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  },
  low: {
    label: "Low",
    dot: "bg-green-500",
    badge:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  },
};

function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const priority = PRIORITY[task.priority] ?? PRIORITY.medium;
  const isCompleted = task.status === "completed";

  // Due date logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = due && due < today && !isCompleted;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handlers
  const handleToggleStatus = () => {
    onUpdate(task._id, { status: isCompleted ? "pending" : "completed" });
  };

  const handleEditSubmit = async (formData) => {
    await onUpdate(task._id, formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      // auto reset confirm after 3 seconds if user doesn't click again
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete(task._id);
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border shadow-sm transition-all duration-200 ${isCompleted ? "border-gray-200 dark:border-gray-700 opacity-75" : "border-gray-200 dark:border-gray-700 hover:shadow-md"}`}
    >
      {isEditing ? (
        // Edit mode
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Edit task
          </h3>
          <TaskForm
            initialData={task}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        // View mode
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Check box */}
            <button
              onClick={handleToggleStatus}
              title={isCompleted ? "Mark as pending" : "Mark as completed"}
              className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 cursor-pointer ${isCompleted ? "bg-green-500 border-green-500" : "border-gray-400 darK:border-gray-500 hover:border-green-400"}`}
            >
              {isCompleted && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>

            {/* Context */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <p
                className={`text-sm font-semibold leading-snug break-words ${isCompleted ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-white"}`}
              >
                {task.title}
              </p>

              {/* Description */}
              {task.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-words">
                  {task.description}
                </p>
              )}

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {/* Priority badge */}
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${priority.badge}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}
                  />
                  {priority.label}
                </span>

                {/* Due date */}
                {due && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${isOverdue ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {isOverdue ? "Overdue " : ""}
                    {formatDate(task.dueDate)}
                  </span>
                )}

                {/* Completed badge */}
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                    ✅ Done
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Edit button */}
              <button
                onClick={() => setIsEditing(true)}
                title="Edit task"
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>

              {/* Delete button */}
              <button
                onClick={handleDelete}
                title={confirmDelete}
                className={`p-1.5 rounded-lg transition-colors duration-200 cursor-pointer ${confirmDelete ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400" : "text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;
