// import * as React from "react";
// import  {Project} from "../graphql/types";

// interface Props {
//   projects: Project[];
//   selectedProjectId: string | null;
//   onSelect: (id: string) => void;
//   onAddProject: () => void;
//   loading: boolean;
//   error?: Error;
// }

// const ProjectSidebar: React.FC<Props> = ({
//   projects,
//   selectedProjectId,
//   onSelect,
//   onAddProject,
//   loading,
//   error,
// }) => {
//   return (
//     <aside className="w-64 bg-white border-r shadow-sm p-4 flex flex-col">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
//         <button
//           onClick={onAddProject}
//           className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
//         >
//           + Add
//         </button>
//       </div>

//       {loading && <p className="text-gray-500">Loading projects…</p>}
//       {error && <p className="text-red-600">{error.message}</p>}

//       <div className="flex-1 overflow-y-auto space-y-2">
//         {!loading && projects.length === 0 && (
//           <p className="text-gray-500">No projects found</p>
//         )}

//         {projects.map((project) => (
//           <div
//             key={project.id}
//             onClick={() => onSelect(project.id)}
//             className={`p-3 rounded cursor-pointer transition
//               ${
//                 selectedProjectId === project.id
//                   ? "bg-blue-100 text-blue-800 font-semibold"
//                   : "hover:bg-gray-100"
//               }`}
//           >
//             <div className="flex justify-between items-center">
//               <span>{project.name}</span>
//               <span className="text-xs capitalize text-gray-500">
//                 {project.status}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </aside>
//   );
// };

// export default ProjectSidebar;

import * as React from 'react';
import {Project} from "../graphql/types";

interface ProjectSidebarProps{
  projects: Project[];

  loading: boolean;
  error?: Error

  /* Navigation */

  activeView: "PROJECTS" | "TASKS"
  onShowProjects: ()=> void;

  /* Project Workspace */

  selectedProjectId: string | null;
  onSelect: (projectId:string) => void;
  onEditProject: (project: Project)=> void;

  /* Actions */

  onAddProject: ()=>void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps>=({
  projects,
  loading,
  error,
  activeView,
  onShowProjects,
  selectedProjectId,
  onSelect,
  onEditProject,
  onAddProject,
})=>{
  return(
    <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
      {/* App / Section Title */}
      <div className="px-4 py-4 border-b">
        <h1 className="text-lg font-semibold text-grey-800">
          Project Manager
        </h1>
      </div>
      {/* Main Navigation*/}

      <nav className="px-2 py-3 space-y-1">
        <button
         onClick={onShowProjects}
         className={`w-full text-left px-3 py-2 rounded text-sm font-medium
          ${
            activeView === "PROJECTS"
            ? "bg-blue-100 text-blue-700"
           : "hover:bg-gray-100 text-gray-700"
          }`}
          >
            📁 Projects
          </button>
      </nav>
      {/* Divider */}
      <div className="border-t my-2" />

      {/* Project List (only meaningful in TASKS view) */}
      <div className="flex-1 overflow-y-auto px-2">
        {activeView==="TASKS"&&(
          <>
          <div className="flex justify-between items-center px-2 py-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Your Projects
            </span>
            <button
            onClick={onAddProject}
            className="text-xs text-blue-600 hover:underline"
            >
              + Add
            </button>
          </div>
          {loading && (
            <p className="px-2 text-sm text-gray-500">
              Loading Projects...
            </p>
          )}

          {error && (
            <p className="px-2 text-sm text-red-600">
              {error.message}
            </p>
          )}
          {!loading && 
           !error &&
           projects.map((project)=>{
            const isActive= project.id===selectedProjectId;
            return(
              <div
               key={project.id}
               onClick={()=> onSelect(project.id)}
               className={`group px-3 py-2 rounded cursor-pointer text-sm}
                ${isActive
                  ? "bg-blue-100 text-blue-800  font-medium"
                  : "hover:bg-gray-100 text-gray-700"
                }`
               }
               >
                <div className="flex justify-between items-center">
                  <span>{project.name}</span>
                  <button
                  onClick={(e)=>{
                    e.stopPropagation();
                    onEditProject(project);
                  }}
                  className="text-xs text-blue-600 opacity-0
                  group-hover:opacity-100 hover:underline"
                  >
                    Edit
                  </button>
                </div>
               </div>
            )
           })}
          </>
        )}
      </div>
    </aside>
  )
}
export default ProjectSidebar;