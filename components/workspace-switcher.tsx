"use client";

import { RiAddCircleFill } from "react-icons/ri";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUserWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";

type Props = {};

export default function WorkspaceSwitcher({}: Props) {
  const { data: workspaces, error, isPending } = useGetUserWorkspaces();

  // if (isPending) return;

  console.log(workspaces);
  // if (!workspaces) return null;
  // {
  //   workspaces === null && null;
  // }
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>

      {isPending && null}

      {workspaces && workspaces.length > 0 ? (
        <Select>
          <SelectTrigger className="w-full p-1 font-medium bg-neutral-200">
            <SelectValue placeholder="No workspace selected" />
          </SelectTrigger>
          <SelectContent>
            {workspaces?.map((workspace) => (
              <SelectItem key={workspace._id} value={workspace._id}>
                <div className="flex items-center justify-start gap-3 font-medium">
                  <WorkspaceAvatar
                    name={workspace.workspaceName}
                    image={workspace.workspaceAvatar ?? ""}
                  />
                  <span className="truncate">{workspace.workspaceName}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
    </div>
  );
}
