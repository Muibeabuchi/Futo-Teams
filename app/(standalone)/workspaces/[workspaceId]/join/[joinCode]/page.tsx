import { Id } from "@/convex/_generated/dataModel";
import { getWorkspaceInfo } from "@/features/workspaces/actions";
import { redirect } from "next/navigation";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";

interface JoinWorkspacePageProps {
  params: {
    workspaceId: Id<"workspaces">;
    workspaceJoinCode: string;
  };
}

export default async function JoinWorkspacePage({
  params: { workspaceJoinCode, workspaceId },
}: JoinWorkspacePageProps) {
  const workspaceInfo = await getWorkspaceInfo({ workspaceId });
  if (!workspaceInfo) redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        workspaceName={workspaceInfo.workspaceName}
        workspaceId={workspaceId}
        workspaceJoinCode={workspaceJoinCode}
      />
    </div>
  );
}
