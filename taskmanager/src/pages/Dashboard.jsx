import { useState, useEffect, use } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";

const FILTERS = ["all", "pending", "completed"];

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tasks");
      setTasks(data.data); // backend will returns {success, count, data: [...]}
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  // Add task
  const handleAddTask = async (formData) => {
    try {
      const { data } = await api.post("/tasks", formData);
      setTasks((prev) => [data.data, ...prev]); // prepand new task
      setShowForm(false);
      toast.success("Task added!");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to add task");
    }
  };

  // Update task (edit or toggle status)
  const handleUpdateTask = async (id, updatedFields) => {
    // Update UI immediately
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, ...updatedFields } : t)),
    );

    try {
      const { data } = await api.put(`/tasks/${id}`, updatedFields);
      // Sync with server response
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? data.data : t)),
      );
      toast.success("Task updated");
    } catch (error) {
      // update on failure
      fetchTasks();
      toast.error(error.response?.data?.message ?? "Failed to update task");
    }
  };

  // Delete Task
  const handleDeleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));

    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
    } catch (error) {
      // Revert on failure
      fetchTasks();
      toast.error(error.response?.data?.message ?? "Failed to delete task.");
    }
  };

  // Filtered tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  // Stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Tasks
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Stay organised, get things done.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "Total",
              value: total,
              color: "text-blue-600 dark:text-blue-400",
            },
            {
              label: "Pending",
              value: pending,
              color: "text-yellow-600 dark:text-yellow-400",
            },
            {
              label: "Completed",
              value: completed,
              color: "text-green-600 dark:text-green-400",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Add task toggle button */}
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="w-full mb-4 py-2.5 px-4 rounded-xl border-2 border-dashed text-sm font-medium border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          {showForm ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentcolor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentcolor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add new Task
            </>
          )}
        </button>

        {/* Add Task Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 darK:border-gray-700 shadow-sm p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 darK:text-gray-300 mb-4">
              New Task
            </h3>
            <TaskForm
              onSubmit={handleAddTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium capitalize transition-colors duration-200 cursor-pointer ${filter === f ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              {f}{" "}
              {f === "pending" && pending > 0 && (
                <span className="ml-1.5 text-xs bg-yellow-100 text-yellow-700 darK:bg-yellow-900/40 dark:text-yellow-400 px-1.5 py-0.5 rounded-full">
                  {pending}
                </span>
              )}
              {f === "completed" && completed > 0 && (
                <span className="ml-1.5 text-xs bg-green-100 text-green-700 darK:bg-green-900/40 dark:text-green-400 px-1.5 py-0.5 rounded-full">
                  {completed}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <svg
              className="animate-spin w-8 h-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth={4}
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <p className="text-sm text-gray-400">Loading tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
