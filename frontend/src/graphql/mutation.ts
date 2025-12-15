import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
   mutation CreateProject(
    $name: String!
    $description: String
    $status: String!
  ) {
    createProject(
      name: $name
      description: $description
      status: $status
    ) {
      project {
        id
        name
        status
        totalTasks
        completedTasks
        completionRate
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $projectId: ID!
    $name: String
    $description: String
    $status: String
    $dueDate: Date
  ) {
    updateProject(
      projectId: $projectId
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
        id
        name
        description
        status
        dueDate
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: ID!
    $title: String!
    $description: String
    $status: String!
    $assigneeEmail: String
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
    ) {
      task {
        id
        title
        description
        status
        assigneeEmail
      }
    }
  }
`;
export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $taskId: ID!
    $status: String
  ) {
    updateTask(
      taskId: $taskId
      status: $status
    ) {
      task {
        id
        status
      }
    }
  }
`;

export const ADD_TASK_COMMENT = gql`
  mutation AddTaskComment(
    $taskId: ID!
    $content: String!
    $authorEmail: String!
  ) {
    addTaskComment(
      taskId: $taskId
      content: $content
      authorEmail: $authorEmail
    ) {
      comment {
        id
        content
        authorEmail
        timestamp
      }
    }
  }
`;


