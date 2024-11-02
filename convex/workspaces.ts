import {
  customQuery,
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

// const authenticatedUserQuery = customQuery(
//   query,
//   customCtx(async (ctx) => {
//     const userId = await getAuthUserId(ctx);

//     if (userId === null) return null;
//     const user = await ctx.db.get(userId);
//     if (!user) return null;
//     return { user };
//   })
// );

// const authorizedWorkspaceQuery = customQuery(query, {
//   args: {
//     workspaceId: v.id("workspaces"),
//   },
//   async input(ctx, args) {
//     const workspace = await ctx.db.get(args.workspaceId);
//     if (!workspace) return null;
//     // const isWorkspaceCreator = workspace.workspaceCreator ===
//   },
// });

export const getUserWorkspace = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    const workspaces = await ctx.db
      .query("workspaces")
      .withIndex("by_workspace_creator", (q) =>
        q.eq("workspaceCreator", user._id)
      )
      .collect();

    const workspacesWithAvatar = await Promise.all(
      workspaces.map(async (workspace) => {
        if (!workspace.workspaceAvatar)
          return { ...workspace, workspaceAvatar: "" };
        const avatarUrl = await ctx.storage.getUrl(workspace.workspaceAvatar);
        return {
          ...workspace,
          workspaceAvatar: avatarUrl,
        };
      })
    );

    return workspacesWithAvatar;
  },
});

const authenticatedUserMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Unauthorized");

    return { ctx: { userId }, args: {} };
  },
});

// const authorizedUserMutation= authenticatedUserMutation()

export const generateUploadUrl = authenticatedUserMutation({
  args: {},
  async handler(ctx) {
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = authenticatedUserMutation({
  args: {
    workspaceName: v.string(),
    workspaceImageId: v.optional(v.id("_storage")),
  },
  async handler(ctx, args) {
    const workspaceId = await ctx.db.insert("workspaces", {
      workspaceName: args.workspaceName,
      workspaceCreator: ctx.userId,
      workspaceAvatar: args.workspaceImageId,
    });
    return workspaceId;
  },
});
