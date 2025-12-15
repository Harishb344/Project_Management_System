
export const TASK_STATUSES = [
  "todo",
  "in_progress",
  "done",
] as const;

export type TaskStatus = typeof TASK_STATUSES[number];

export interface Project{
    id: string;
    name: string;
    status:ProjectStatus;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    dueDate?:string;
    tasks: Task[]; 
}

export interface GetProjectsResponse{
    projects: Project[]
}

export const PROJECT_STATUSES = [
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
] as const;

export type ProjectStatus = typeof PROJECT_STATUSES[number]; 

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    assigneeEmail: string;
    dueDate?: string;
 
  }
  export interface GetTasksByProjectResponse {
    tasks: Task[];
  }

  export interface TaskComment {
    id: string;
    content: string;
    authorEmail: string;
    timestamp: string;
  }
  export interface GetTaskCommentsResponse {
    taskComments: TaskComment[];
  }