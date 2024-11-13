import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

export function useProjectId() {
  const params = useParams();
  return params?.projectId as Id<"projects">;
}
