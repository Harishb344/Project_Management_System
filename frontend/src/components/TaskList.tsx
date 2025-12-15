import { Task } from "../graphql/types";
import { useState } from "react";
import TaskComments from "./TaskComments";

const statusStyles: Record<string, string> = {
  TODO: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  DONE: "bg-green-100 text-green-700",
};

interface Props {
  tasks: Task[];
  loading: boolean;
  error?: Error;
  onEdit: (task: Task) => void;
}
const TaskList: React.FC<Props> = ({
    
  tasks,
  loading,
  error,
  onEdit,
}) => {
    
const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  if (loading) {
    return <p className="text-gray-500">Loading tasks…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error.message}</p>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-gray-500 text-center py-16">
        No tasks created yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {tasks.map((task) =>{
        const isOpen= openTaskId== task.id;
        return(
        <div
          key={task.id}
          className="group bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-800">
              {task.title}
            </h3>

            <span
              className={`text-xs px-2 py-1 rounded ${statusStyles[task.status]}`}
            >
              {task.status}
            </span>
          </div>


          {task.description && (
            <p className="text-sm text-gray-500 mb-2">
              {task.description}
            </p>
          )}

 
          <div className="flex justify-between items-center mt-3">
            {task.assigneeEmail ? (
              <p className="text-xs text-gray-400">
                Assigned to: {task.assigneeEmail}
              </p>
            ) : (
              <span />
            )}

            {/* Edit button */}
            <button
              disabled={task.status==="done"}
              onClick={() => onEdit(task)}
              className={`text-xs px-2 py-1 rounded transition
                ${
                  task.status === "done"
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }
              `}
            >
              Edit
            </button>
           <button
                onClick={() =>
                  setOpenTaskId(isOpen ? null : task.id)
                }
                className="text-xs text-blue-600 hover:underline"
              >
                {isOpen ? "Hide Comments" : "View Comments"}
              </button>
            </div>

            {isOpen && (
              <div className="mt-4 border-t pt-3">
                <TaskComments taskId={task.id} />
              </div>
            )}
            </div>
          );
        })}
      </div>
    );
  };
  

export default TaskList;
