import { fetchQuery } from "convex/nextjs";

import { Id } from "@/convex/_generated/dataModel";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@/convex/_generated/api";

type getWorkspaceInfoProps = {
  workspaceId: Id<"workspaces">;
};

export async function getWorkspaceInfo({ workspaceId }: getWorkspaceInfoProps) {
  return await fetchQuery(
    api.workspaces.getWorkspaceById,
    { workspaceId },
    {
      token: convexAuthNextjsToken(),
    },
  );
}
