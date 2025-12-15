import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_TASK } from "../graphql/mutation";
import { Task } from "../graphql/types";

interface CreateTaskModalProps {
  projectId: string;
  onClose: () => void;
  onTaskCreated?: () => void;
}

type CreateTaskMutationResponse = {
  createTask: {
    task: Task;
  };
};

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "DONE"] as const;

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  projectId,
  onClose,
  onTaskCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<(typeof STATUS_OPTIONS)[number]>("TODO");
  const [assigneeEmail, setAssigneeEmail] = useState("");

  const [createTask, { loading, error }] =
    useMutation<CreateTaskMutationResponse>(CREATE_TASK, {
      onCompleted: () => {
        onTaskCreated?.();
        onClose();
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask({
      variables: {
        projectId,
        title,
        description,
        status,
        assigneeEmail,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Create Task</h2>

        {error && (
          <p className="text-red-600 mb-2">{error.message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as (typeof STATUS_OPTIONS)[number])
            }
            className="w-full border px-3 py-2 rounded"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="email"
            placeholder="Assignee Email"
            value={assigneeEmail}
            onChange={(e) => setAssigneeEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
