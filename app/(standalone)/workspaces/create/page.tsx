import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

type Props = {};

function WorkspaceCreatePage({}: Props) {
  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
}

export default WorkspaceCreatePage;
