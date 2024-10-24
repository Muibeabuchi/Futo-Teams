import {
  customQuery,
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

const authenticatedUserQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    return { user };
  })
);

const authenticatedUserMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Unauthorized");

    return { ctx: {}, args: {} };
  },
});

export const create = authenticatedUserMutation({
  args: {
    workspaceName: v.string(),
  },
  async handler(ctx, args) {
    const workspaceId = await ctx.db.insert("workspaces", {
      workspaceName: args.workspaceName,
    });
    return workspaceId;
  },
});
