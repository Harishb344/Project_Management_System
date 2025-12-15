import { useState } from "react";
import {
    PROJECT_STATUSES,
    ProjectStatus,
  } from "../graphql/types.ts"

export interface ProjectFormValues
{
    name: string;
    description?:string;
    status: "ACTIVE"| "ON_HOLD"| "COMPLETED"
    due_date?:string;
}

interface ProjectFormProps{
    initialValues?: ProjectFormValues;
    onCancel:()=>void;
    onSubmit: (values: ProjectFormValues)=>void;
    loading?: boolean;

}

const ProjectForm: React.FC<ProjectFormProps>=({
    initialValues,
    onSubmit,
    onCancel,
    loading,
})=>{
    const[name, setName]=useState(initialValues?.name ?? "");
    const[description,setDescription]= useState(
        initialValues?.description ?? ""
    );
    const [status, setStatus] = useState<ProjectStatus>(
        initialValues?.status ?? "ACTIVE"
      );
    const [dueDate, setdueDate]= useState(
        initialValues?.due_date ?? "" 
    );

    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();

        if(!name.trim())
        {
            alert("Project name is required");
            return;
        }

        onSubmit({
            name: name.trim(),
            description,
            status,
            due_date: dueDate || undefined,
        });
    };

    return(

        <form onSubmit={handleSubmit} className="space-y-3">
            <input
            className="w-full border p-2 rounded"
            placeholder="Project name"
            value={name}
            onChange={(e)=> setName(e.target.value)}
            />

            <textarea
            className="w-full border p-2 rounded"
            placeholder="Description"
            value={description}
            onChange={(e)=> setDescription(e.target.value)}
            />

            <select
             className="w-full border p-2 rounded"
             value={status}
             onChange={(e)=>{
                const value= e.target.value;
                if(PROJECT_STATUSES.includes(value as ProjectStatus))
                {
                    setStatus(value as ProjectStatus)
                }
             }}
             >
             {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
              </select>

            <input
            type="date"
            className="w-full border p-2 rounded"
            value={dueDate}
            onChange={(e)=>setdueDate(e.target.value)}
            />
            
           <div>
            <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded"
            >  
            </button>

            <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Saving..." : "Save"}
        </button>
           </div>
        </form>
    )
}

export default ProjectForm;