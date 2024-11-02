import { api } from "@/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

export const useGetUserWorkspaces = () => {
  return useQuery(convexQuery(api.workspaces.getUserWorkspaces, {}));
};
