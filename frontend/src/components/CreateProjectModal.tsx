import { useMutation } from "@apollo/client/react";
import { CREATE_PROJECT } from "../graphql/mutation";
import { GET_PROJECTS } from "../graphql/queries";
import ProjectForm, { ProjectFormValues } from "./ProjectForm";

interface Props {
  onClose: () => void;
}

const CreateProjectModal: React.FC<Props> = ({ onClose }) => {
  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [GET_PROJECTS],
  });

  const handleSubmit = async (values: ProjectFormValues) => {
    await createProject({
      variables: {
        name: values.name,
        description: values.description,
        status: values.status,
        dueDate: values.due_date,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Project</h2>

        {error && (
          <p className="text-red-600 text-sm mb-2">{error.message}</p>
        )}

        <ProjectForm
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default CreateProjectModal;
