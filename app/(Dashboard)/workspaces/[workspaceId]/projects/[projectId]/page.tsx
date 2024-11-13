import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { getProject } from "@/features/projects/actions";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProjectIdPageProps = {
  params: {
    projectId: Id<"projects">;
    workspaceId: Id<"workspaces">;
  };
};

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  const project = await getProject({
    projectId: params.projectId,
    workspaceId: params.workspaceId,
  });
  if (!project) throw notFound();

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project?.projectName}
            image={project.projectImage}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.projectName}</p>
          {/* ProjectId:{params.projectId} */}
        </div>
        <div className="">
          <Button asChild size="sm" variant={"secondary"}>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project._id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher />
    </div>
  );
};

export default ProjectIdPage;
