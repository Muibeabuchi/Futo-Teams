import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    workspaceName: v.string(),
    workspaceCreator: v.id("users"),
    workspaceAvatar: v.optional(v.id("_storage")),
    workspaceInviteCode: v.string(),
  }).index("by_workspace_creator", ["workspaceCreator"]),
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member")),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_by_workspaceId", ["userId", "workspaceId"])
    .index("by_workspaceId", ["workspaceId"]),
  projects: defineTable({
    projectImage: v.optional(v.id("_storage")),
    projectName: v.string(),
    workspaceId: v.id("workspaces"),
  })
    .index("by_workspaceId", ["workspaceId"])
    .index("by_projectName", ["projectName"]),
  // Your other tables...
});

export default schema;
