import { v } from "convex/values";

import { authenticatedUserQuery, authorizedWorkspaceQuery } from "./middleware";

export const get = authorizedWorkspaceQuery({
  args: {
    workspaceId: v.id("workspaces"),
  },
  async handler(ctx, args) {
    // grab all the projects for the workspace
    return await ctx.db
      .query("projects")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();
  },
});
