import {
  customQuery,
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { ConvexError, v } from "convex/values";

import { getAuthUserId } from "@convex-dev/auth/server";
import { generateInviteCode } from "../lib/utils";

import { mutation, query } from "./_generated/server";

// !MIDDLEWARES
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

const authorizedWorkspaceMutation = customMutation(mutation, {
  args: {
    workspaceId: v.id("workspaces"),
  },
  async input(ctx, args) {
    const userId = await getAuthUserId(ctx);

    if (userId === null) throw new ConvexError("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new ConvexError("Unauthorized");

    // grab the workspace
    // const workspace = await ctx.db.get(args.workspaceId);
    // if (!workspace) throw new ConvexError("Workspace does not exist!");

    // TODO: check if the user is also an member and admin

    // check if the user is a member of the workspace
    const member = await ctx.db
      .query("members")
      .withIndex("by_userId_by_workspaceId", (q) =>
        q.eq("userId", user._id).eq("workspaceId", args.workspaceId)
      )
      .unique();
    if (!member) throw new ConvexError("Unauthorized");

    // check if the member is an admin
    const isAdmin = member.role === "admin";

    // check if the user is the creator
    if (!isAdmin)
      throw new ConvexError(
        "You do not have permission to change this workspace"
      );

    return { ctx: { member }, args };
  },
});

export const getUserWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;

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
    console.log("workspaces", workspaces);

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

// ! UPLOAD FILE GENERATION
export const generateUploadUrl = authenticatedUserMutation({
  args: {},
  async handler(ctx) {
    return await ctx.storage.generateUploadUrl();
  },
});

// ! DATABASE QUERIES & MUTATIONS
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
    workspaceAvatar: v.id("_storage"),
  },
  async handler(ctx, args) {
    //? we have access to the workspace document in the ctx argument

    // update the workspace
    await ctx.db.patch(args.workspaceId, {
      workspaceName: args.workspaceName,
      workspaceAvatar: args.workspaceAvatar,
    });
  },
});
