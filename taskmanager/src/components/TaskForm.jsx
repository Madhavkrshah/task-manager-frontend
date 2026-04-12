import { useState, useEffect } from "react";

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
  status: "pending",
};

function TaskForm({ onSubmit, initialData = null, onCancel }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If editing, pre filled the form with existing task data
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        priority: initialData.priority || "medium",
        // Backend stores dueData as ISO string
        dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 10) : "",
        status: initialData.status || "pending",
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);

    // Reset only when adding (not editing)
    if (!initialData) setFormData(EMPTY_FORM);
  };

  const isEditing = !!initialData;

  //   shared input class
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          required
          className={inputCls}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add some details... (optional)"
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Priority + Due Date side-by-side */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={inputCls}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <input
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className={inputCls}
          />
        </div>
      </div>

      {/* Status only show when editing */}
      {isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputCls}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={isSubmitting || !formData.title.trim()}
          className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx={12}
                  cy={12}
                  r={10}
                  stroke="currentColor"
                  strokeWidth={4}
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              {isEditing ? "Saving..." : "Adding..."}
            </>
          ) : isEditing ? (
            "Save changes"
          ) : (
            "Add task"
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
