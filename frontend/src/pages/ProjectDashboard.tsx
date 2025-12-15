import { useState } from "react";
import { useQuery } from "@apollo/client/react";

import {
  GET_PROJECTS,
  GET_TASKS_BY_PROJECT,
} from "../graphql/queries";

import type {
  GetProjectsResponse,
  GetTasksByProjectResponse,
  Project,
  Task,
} from "../graphql/types";

import ProjectSidebar from "../components/ProjectSidebar";
import ProjectGrid from "../components/ProjectGrid";
import TaskList from "../components/TaskList";

import CreateProjectModal from "../components/CreateProjectModal";
import EditProjectModal from "../components/EditProjectModal";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";

type ActiveView= "PROJECTS" | "TASKS";
const ProjectDashboard = () => {
  /* ---------------- State ---------------- */
  const [activeView, setActiveView] =
    useState<ActiveView>("PROJECTS");

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [showCreateProject, setShowCreateProject] =
    useState(false);
  const [showEditProject, setShowEditProject] =
    useState(false);
  const [showCreateTask, setShowCreateTask] =
    useState(false);

  /* ---------------- Projects ---------------- */
  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
  } = useQuery<GetProjectsResponse>(GET_PROJECTS, {
    fetchPolicy: "network-only",
  });

  /* ---------------- Tasks ---------------- */
  const {
    data: tasksData,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery<GetTasksByProjectResponse>(
    GET_TASKS_BY_PROJECT,
    {
      variables: { projectId: selectedProject?.id },
      skip: !selectedProject,
      fetchPolicy: "network-only",
    }
  );

  /* ---------------- Render ---------------- */
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ========== Sidebar ========== */}
      <ProjectSidebar
        projects={projectsData?.projects ?? []}
        loading={projectsLoading}
        error={projectsError}
        activeView={activeView}
        selectedProjectId={selectedProject?.id ?? null}
        onShowProjects={() => {
          setActiveView("PROJECTS");
          setSelectedProject(null);
        }}
        onSelect={(projectId) => {
          const project =
            projectsData?.projects.find(
              (p) => p.id === projectId
            ) ?? null;

          setSelectedProject(project);
          setActiveView("TASKS");
        }}
        onAddProject={() => setShowCreateProject(true)}
        onEditProject={(project) => {
          setSelectedProject(project);
          setShowEditProject(true);
        }}
      />

      {/* ========== Main Content ========== */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* PROJECTS VIEW */}
        {activeView === "PROJECTS" && (
          <ProjectGrid
            projects={projectsData?.projects ?? []}
            loading={projectsLoading}
            error={projectsError}
            onSelect={(project) => {
              setSelectedProject(project);
              setActiveView("TASKS");
            }}
          />
        )}

        {/* TASKS VIEW */}
        {activeView === "TASKS" && selectedProject && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  {selectedProject.name}
                </h1>
                <p className="text-sm text-gray-500">
                  Manage tasks for this project
                </p>
              </div>

              <button
                onClick={() => setShowCreateTask(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                + Add Task
              </button>
            </div>

            <TaskList
              tasks={tasksData?.tasks ?? []}
              loading={tasksLoading}
              error={tasksError}
              onEdit={(task) => setEditingTask(task)}
            />
          </>
        )}
      </main>

      {/* ========== Modals ========== */}
      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
        />
      )}

      {showEditProject && selectedProject && (
        <EditProjectModal
          project={selectedProject}
          onClose={() => setShowEditProject(false)}
        />
      )}

      {showCreateTask && selectedProject && (
        <CreateTaskModal
          projectId={selectedProject.id}
          onClose={() => setShowCreateTask(false)}
          onTaskCreated={() => refetchTasks()}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdated={() => {
            refetchTasks();
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectDashboard;
