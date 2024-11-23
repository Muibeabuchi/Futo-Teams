// type ProjectIdSettingsPageProps = {};

// const ProjectIdSettingsPage = (props: ProjectIdSettingsPageProps) => {
//   return <div>ProjectIdSettingsPage</div>;
// };

// export default ProjectIdSettingsPage;

import React from "react";

import { Id } from "@/convex/_generated/dataModel";
import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { notFound } from "next/navigation";
import { UpdateProjectForm } from "@/features/projects/components/update-project-form";

type ProjectIdSettingsPageProps = {
  params: {
    workspaceId: Id<"workspaces">;
    projectId: Id<"projects">;
  };
};

const ProjectIdSettingsPage = async ({
  params,
}: ProjectIdSettingsPageProps) => {
  // attempt to fetch the data for this workspace on the server
  const project = await fetchQuery(
    api.projects.getById,
    { workspaceId: params.workspaceId, projectId: params.projectId },
    {
      token: convexAuthNextjsToken(),
    }
  );

  if (!project) {
    return notFound();
  }

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateProjectForm
        // onCancel={() => {}}
        initialValues={{
          ...project,
          projectImage: project.projectImage,
        }}
      />
      {/* Project Settings page : {project.projectName} */}
    </div>
  );
};

export default ProjectIdSettingsPage;
