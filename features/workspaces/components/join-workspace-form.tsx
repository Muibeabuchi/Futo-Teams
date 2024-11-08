"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DottedSeparator } from "@/components/doted-separator";
import { Button } from "@/components/ui/button";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";

interface JoinWorkspaceFormProps {
  workspaceName: string;
  workspaceId: Id<"workspaces">;
  workspaceJoinCode: string;
}

export const JoinWorkspaceForm = ({
  workspaceJoinCode,
  workspaceName,
  workspaceId,
}: JoinWorkspaceFormProps) => {
  const router = useRouter();

  const { mutate: joinWorkspace, isPending: isJoiningWorkspace } =
    useJoinWorkspace();

  const handleJoinWorkspace = () => {
    joinWorkspace(
      {
        workspaceId,
        workspaceInviteCode: workspaceJoinCode,
      },
      {
        onSuccess() {
          router.replace(`/workspaces/${workspaceId}`);
        },
      },
    );
  };

  return (
    <Card className="w-full h-full shadow-none border-none">
      <CardHeader className={"p-7"}>
        <CardTitle className={"text-xl font-bold"}>Join Workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{workspaceName}</strong>
        </CardDescription>
      </CardHeader>
      <div className={"px-7"}>
        <DottedSeparator />
      </div>
      <CardContent className={"p-7"}>
        <div
          className={
            "flex flex-col md:flex-row gap-2 items-center md:justify-between"
          }
        >
          <Button
            variant={"secondary"}
            className={"w-full md:w-fit"}
            disabled={isJoiningWorkspace}
            asChild
          >
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button
            onClick={handleJoinWorkspace}
            className={"w-full md:w-fit"}
            disabled={isJoiningWorkspace}
          >
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
