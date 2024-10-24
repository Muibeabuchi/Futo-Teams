import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
// import { Infer } from "convex/values";
// import { infer } from "zod";

// type ReturnType = (typeof api.workspaces.create)["_returnType"];
// type ResponseType = (typeof api.workspaces.create)["_args"];

export const useCreateWorkspace = () => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.workspaces.create),
    onSuccess: () => {
      toast.success("Workspace created successfully");
    },
    onError: () => {
      toast.error("Failed to create workspace");
    },
  });
  return mutation;
};
