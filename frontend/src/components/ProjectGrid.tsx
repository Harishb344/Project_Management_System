import * as React from 'react';

import { Project } from '../graphql/types';
import ProjectCard from './ProjectCard';

interface ProjectGridProps{
    projects: Project[];
    loading?: boolean;
    error?: Error;
    onSelect: (project:Project) => void;
}

const ProjectGrid: React.FC<ProjectGridProps>=({
    projects,
    loading,
    error,
    onSelect
})=>{
    if(loading){
        return(
      <div className="text-gray-500 text-center py-20">
        Loading Projects...
      </div>
    )
}
   if(error)
   {
    return(
        <div className="text-gray-500 text-center py-20">
            {error.message}
            </div>
    )
   }
   if(projects.length==0)
   {
    return(
        <div className="text-gray-500 text-center py-20">
        <p className="text-lg font-medium">
          No projects found
        </p>
        <p className="text-sm mt-2">
          Create your first project to get started
        </p>
      </div>
    )
   }
   return(
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => onSelect(project)}
        />
      ))}
    </div>
   )
}
export default ProjectGrid;