import { ConvexError, v } from "convex/values";

import {
  authenticatedUserQuery,
  authorizedWorkspaceMutation,
  authorizedWorkspaceQuery,
} from "./middleware";

export const get = authorizedWorkspaceQuery({
  args: {
    workspaceId: v.id("workspaces"),
  },
  async handler(ctx, args) {
    // grab all the projects for the workspace
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();

    // TODO: crosscheck this return type
    if (!projects) return null;

    return await Promise.all(
      projects.map(async (project) => {
        if (!project.projectImage)
          return {
            ...project,
            projectImage: "",
          };
        const projectImage =
          (await ctx.storage.getUrl(project.projectImage)) ?? "";

        return {
          ...project,
          projectImage,
        };
      })
    );

    // return
  },
});

export const create = authorizedWorkspaceMutation({
  args: {
    projectName: v.string(),
    projectImage: v.optional(v.id("_storage")),
  },
  async handler(ctx, args) {
    // Only admins are allowed to create projects in the workspace
    if (ctx.member.role !== "admin")
      throw new ConvexError("Unauthorized, Only admins can create projects");

    return await ctx.db.insert("projects", {
      workspaceId: args.workspaceId,
      projectName: args.projectName,
      projectImage: args.projectImage,
    });
  },
});
