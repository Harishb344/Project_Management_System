import { useMutation } from "@apollo/client/react";
import { UPDATE_PROJECT } from "../graphql/mutation";
import { GET_PROJECTS } from "../graphql/queries";
import ProjectForm, { ProjectFormValues } from "./ProjectForm";
import { Project } from "../graphql/types";

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  onClose,
}) => {
  const [updateProject, { loading, error }] = useMutation(
    UPDATE_PROJECT,
    {
      refetchQueries: [GET_PROJECTS],
    }
  );

  const handleSubmit = async (values: ProjectFormValues) => {
    await updateProject({
      variables: {
        projectId: project.id,
        name: values.name,
        status: values.status,
        dueDate: values.due_date ?? null,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Edit Project
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-3">
            {error.message}
          </p>
        )}

        <ProjectForm
          initialValues={{
            name: project.name,
            status: project.status,
            due_date: project.dueDate ?? "",
          }}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default EditProjectModal;
