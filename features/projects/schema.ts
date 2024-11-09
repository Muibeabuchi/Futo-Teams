// import { v } from "convex/values";
import { z } from "zod";
// import {Id}

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z.instanceof(File).optional(),
  workspaceId: z.string(),
});
export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
  image: z.instanceof(File).optional().or(z.string()),
  workspaceId: z.string(),
});

// type t = z.infer<typeof v.("workspaces")>
