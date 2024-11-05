import { ConvexError, v } from "convex/values";

import { generateInviteCode } from "../lib/utils";
import {
  authenticatedUserMutation,
  authenticatedUserQuery,
  authorizedWorkspaceMutation,
  authorizedWorkspaceQuery,
} from "./middleware";

// ! UPLOAD FILE GENERATION
export const generateUploadUrl = authenticatedUserMutation({
  args: {},
  async handler(ctx) {
    return await ctx.storage.generateUploadUrl();
  },
});

// ! DATABASE QUERIES
export const getUserWorkspaces = authenticatedUserQuery({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db
      .query("members")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user._id))
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

export const getWorkspaceById = authorizedWorkspaceQuery({
  args: {
    workspaceId: v.id("workspaces"),
  },
  async handler(ctx, args) {
    // ? Does the user need to be a member to query this data?
    // Is this user a member of this workspace

    const workspace = await ctx.db.get(ctx.member.workspaceId);
    if (!workspace) return null;
    if (!workspace.workspaceAvatar)
      return {
        ...workspace,
        workspaceAvatar: "",
      };
    // if (workspace.workspaceAvatar) {
    const workspaceAvatar = await ctx.storage.getUrl(workspace.workspaceAvatar);
    if (!workspaceAvatar) return { ...workspace, workspaceAvatar: "" };
    // if (workspaceAvatar) {
    return {
      ...workspace,
      workspaceAvatar: workspaceAvatar,
      // };
      // } else {
      //   return {
      //     ...workspace,
      //     workspaceAvatar: "",
      //   };
      // }
    };
  },
});

// ! DATABASE MUTATIONS
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

export const update = authorizedWorkspaceMutation({
  args: {
    workspaceName: v.optional(v.string()),
    workspaceImageId: v.optional(v.id("_storage")),
  },
  async handler(ctx, args) {
    //? we have access to the workspace document in the ctx argument

    // update the workspace
    await ctx.db.patch(args.workspaceId, {
      workspaceName: args.workspaceName,
      workspaceAvatar: args.workspaceImageId,
    });
    return args.workspaceId;
  },
});

export const remove = authorizedWorkspaceMutation({
  args: {},
  async handler(ctx, args) {
    // TODO: remove the members, tasks and projects as well

    // grab all members of the workspace
    const members = await ctx.db
      .query("members")
      .withIndex("by_workspaceId", (q) =>
        q.eq("workspaceId", ctx.member.workspaceId)
      )
      .collect();

    // delete all members of the workspace
    await Promise.all(
      members.map(async (member) => {
        await ctx.db.delete(member._id);
      })
    );

    await ctx.db.delete(args.workspaceId);
    return args.workspaceId;
  },
});
