import {
  customQuery,
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { ConvexError, v } from "convex/values";

import { getAuthUserId } from "@convex-dev/auth/server";
import { generateInviteCode } from "../lib/utils";

import { mutation, query } from "./_generated/server";

const authenticatedUserQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) throw new ConvexError("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new ConvexError("Unauthorized");
    return { ctx: { user }, args: {} };
  })
);

// const authorizedWorkspaceQuery = customQuery(query, {
//   args: {
//     workspaceId: v.id("workspaces"),
//   },
//   async input(ctx, args) {
//     const userId = await getAuthUserId(ctx);

//     if (userId === null) throw new ConvexError("Unauthorized");
//     const user = await ctx.db.get(userId);
//     if (!user) throw new ConvexError("Unauthorized");

//     // use memberId to fetch all workspaces we are a member of
//     const member= await ctx

//     return { ctx: {}, args: {} };
//   },
// async handler(ctx, args) {
//   const workspace = await ctx.db.get(args.workspaceId);
//   if (!workspace) return null;

//   return {ctx:{}}
//   // const isWorkspaceCreator = workspace.workspaceCreator ===
// },
// });

export const getUserWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    // const workspaces = await ctx.db
    //   .query("workspaces")
    //   .withIndex("by_workspace_creator", (q) =>
    //     q.eq("workspaceCreator", user._id)
    //   )
    //   .collect();

    const members = await ctx.db
      .query("members")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const workspaces = await Promise.all(
      members.map(async (member) => {
        const workspace = await ctx.db.get(member.workspaceId);
        if (!workspace) throw new ConvexError("Error fetching workspace");
        return workspace;
      })
    );

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
      workspaceInviteCode: generateInviteCode(10),
    });

    // create a member document with the user as the admin
    await ctx.db.insert("members", {
      workspaceId: workspaceId,
      role: "admin",
      userId: ctx.userId,
    });

    return workspaceId;
  },
});
