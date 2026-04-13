import TaskItem from "./TaskItem";

function TaskList({ tasks, onUpdate, onDelete }) {
  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          No tasks here
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Add a task above to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
