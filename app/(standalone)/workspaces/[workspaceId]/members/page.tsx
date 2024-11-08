import { Id } from "@/convex/_generated/dataModel";
import { MembersList } from "@/features/workspaces/components/members-list";

interface WorkspaceIdMembersPageProps {
  params: {
    workspaceId: Id<"workspaces">;
  };
}

export default async function WorkspaceIdMembersPage({
  params,
}: WorkspaceIdMembersPageProps) {
  //   fetch the data for all the members of this workspace
  return (
    <div className={"w-full lg:max-w-xl"}>
      <MembersList />
    </div>
  );
}
