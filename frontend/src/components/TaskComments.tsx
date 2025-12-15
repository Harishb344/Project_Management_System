import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import { GET_TASK_COMMENTS } from "../graphql/queries";
import { ADD_TASK_COMMENT } from "../graphql/mutation";

import {
  GetTaskCommentsResponse,
  TaskComment,
} from "../graphql/types";

interface Props {
  taskId: string;
}

const TaskComments: React.FC<Props> = ({ taskId }) => {
  const [content, setContent] = useState("");

  /* ---------- Fetch comments ---------- */
  const { data, loading, error } =
    useQuery<GetTaskCommentsResponse>(GET_TASK_COMMENTS, {
      variables: { taskId },
      fetchPolicy: "network-only",
    });

  const comments: TaskComment[] = data?.taskComments ?? [];

  /* ---------- Add comment ---------- */
  const [addComment, { loading: adding }] = useMutation(
    ADD_TASK_COMMENT,
    {
      refetchQueries: [
        {
          query: GET_TASK_COMMENTS,
          variables: { taskId },
        },
      ],
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || adding) return;

    await addComment({
      variables: {
        taskId,
        content,
        authorEmail: "user@example.com", // TODO: replace with auth user
      },
    });

    setContent("");
  };

  /* ---------- Render ---------- */
  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Comments
      </h4>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-gray-500">
          Loading comments…
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">
          {error.message}
        </p>
      )}

      {/* Empty state */}
      {!loading && comments.length === 0 && (
        <p className="text-sm text-gray-400 mb-3">
          No comments yet. Be the first to comment.
        </p>
      )}

      {/* Comments list */}
      <div className="space-y-2 mb-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-50 p-3 rounded-md text-sm"
          >
            <p className="text-gray-800">
              {comment.content}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {comment.authorEmail} •{" "}
              {new Date(comment.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Add comment form */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2"
      >
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={adding || !content.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm
                     hover:bg-blue-700 disabled:opacity-50"
        >
          {adding ? "Adding…" : "Add"}
        </button>
      </form>
    </div>
  );
};

export default TaskComments;
