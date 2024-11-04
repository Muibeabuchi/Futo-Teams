import React from "react";

import { Id } from "@/convex/_generated/dataModel";
import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { notFound } from "next/navigation";

type WorkspaceIdSettingsPageProps = {
  params: {
    workspaceId: Id<"workspaces">;
  };
};

const WorkspaceIdSettingsPage = async ({
  params,
}: WorkspaceIdSettingsPageProps) => {
  // attempt to fetch the data for this workspace on the server
  const workspace = await fetchQuery(
    api.workspaces.getWorkspaceById,
    { workspaceId: params.workspaceId },
    {
      token: convexAuthNextjsToken(),
    }
  );

  if (!workspace) {
    return notFound();
  }

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateWorkspaceForm
        // onCancel={() => {}}
        initialValues={{
          ...workspace,
          workspaceImage: workspace.workspaceAvatar,
        }}
      />
    </div>
  );
};

export default WorkspaceIdSettingsPage;
