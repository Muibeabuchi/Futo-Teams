import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

export function useWorkspaceId() {
  const params = useParams();
  return params?.workspaceId as Id<"workspaces">;
}
