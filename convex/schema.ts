// import { Doc } from "@/convex/_generated/dataModel";
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { Infer, v } from "convex/values";

export const taskStatusValidator = v.union(
  v.literal("BACKLOG"),
  v.literal("TODO"),
  v.literal("IN_PROGRESS"),
  v.literal("DONE"),
  v.literal("IN_REVIEW")
);

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
  tasks: defineTable({
    workspaceId: v.id("workspaces"),
    projectId: v.id("projects"),
    taskName: v.string(),
    assigneeId: v.id("users"),
    description: v.optional(v.string()),
    dueDate: v.string(),
    status: taskStatusValidator,
    position: v.number(),
    // min position = 1000,max position = 1000000
  }).index("by_workspaceId_by_status", ["workspaceId", "status"]),
  // Your other tables...
});

export type taskStatus = Infer<typeof taskStatusValidator>;

export default schema;
