import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    workspaceName: v.string(),
    workspaceCreator: v.id("users"),
    workspaceAvatar: v.optional(v.id("_storage")),
  }).index("by_workspace_creator", ["workspaceCreator"]),
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member")),
  }).index("by_userId", ["userId"]),

  // Your other tables...
});

export default schema;
