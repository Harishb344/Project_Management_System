import { useState } from "react";
import { useMutation } from "@apollo/client/react";

import { UPDATE_TASK } from "../graphql/mutation";
import { Task,TASK_STATUSES, TaskStatus } from "../graphql/types";
import { GET_TASKS_BY_PROJECT, GET_PROJECTS } from "../graphql/queries";

interface Props {
  task: Task;
  onClose: () => void;
  onUpdated: () => void;
}

const EditTaskModal: React.FC<Props> = ({
  task,
  onClose,
  onUpdated,
}) => {
  const [status, setStatus] = useState<TaskStatus>(task.status);
//   const [assigneeEmail, setAssigneeEmail] = useState(
//     task.assigneeEmail ?? ""
//   );

const [updateTask, { loading, error }] = useMutation(UPDATE_TASK, {
    refetchQueries: [
      { query: GET_TASKS_BY_PROJECT },
      { query: GET_PROJECTS },
    ],
  });
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateTask({
      variables: {
        taskId: task.id,
        status,
      },
    });

    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Edit Task
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-2">
            {error.message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as TaskStatus)
            }
            className="w-full border p-2 rounded"
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
