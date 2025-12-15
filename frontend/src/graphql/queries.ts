import { gql } from "@apollo/client";

export const GET_PROJECTS= gql`
query GetProjects{
  projects {
         id
         name
         status
         totalTasks
         completedTasks
         completionRate

     tasks {
        id
        title
        description
        status
        assigneeEmail
      }
   }
}
`;

export const GET_TASKS_BY_PROJECT = gql`
  query GetTasksByProject($projectId: ID!) {
    tasks(projectId: $projectId) {
      id
      title
      description
      status
      assigneeEmail
    }
  }
`;

export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: ID!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      timestamp
    }
  }
`;
