// import * as React from "react";
// import { useNavigate } from "react-router-dom";

// interface ProjectCardProps {
//   id: string;
//   name: string;
//   status: "ACTIVE" | "ON_HOLD" | "COMPLETED";
//   totalTasks: number;
//   completedTasks: number;
//   completionRate: number;
// }

// const statusColors: Record<string, string> = {
//   ACTIVE: "bg-green-100 text-green-800",
//   ON_HOLD: "bg-yellow-100 text-yellow-800",
//   COMPLETED: "bg-gray-100 text-gray-800",
// };

// const ProjectCard: React.FC<ProjectCardProps> = ({
//   id,
//   name,
//   status,
//   totalTasks,
//   completedTasks,
//   completionRate,
// }) => {
//   const navigate = useNavigate();

//   return (
//     <div
//       onClick={() => navigate(`/projects/${id}`)}
//       className="cursor-pointer bg-white p-4 rounded shadow hover:shadow-lg transition"
//     >
//       <div className="flex justify-between items-center mb-2">
//         <h2 className="text-lg font-semibold">{name}</h2>
//         <span
//           className={`px-2 py-1 rounded text-sm ${statusColors[status]}`}
//         >
//           {status}
//         </span>
//       </div>

//       <p className="text-sm text-gray-600">
//         Tasks: {completedTasks}/{totalTasks} ({completionRate}%)
//       </p>
//     </div>
//   );
// };

// export default ProjectCard;
import * as React from "react";
import { Project } from "../graphql/types";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const statusStyles: Record<Project["status"], string> = {
  ACTIVE: "bg-green-100 text-green-700",
  ON_HOLD: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-gray-200 text-gray-700",
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
}) => {
  const completion = project.completionRate ?? 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border shadow-sm
                 hover:shadow-md transition cursor-pointer p-5"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {project.name}
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium
          ${statusStyles[project.status]}`}
        >
          {project.status.replace("_", " ")}
        </span>
      </div>

      {/* Completion */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Completion</span>
          <span className="font-medium">
            {completion}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* Task count */}
      <p className="text-sm text-gray-500 mt-2">
        {project.completedTasks} of {project.totalTasks} tasks completed
      </p>
    </div>
  );
};

export default ProjectCard;
