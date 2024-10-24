import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    workspaceName: v.string(),
  }),
  // Your other tables...
});

export default schema;
