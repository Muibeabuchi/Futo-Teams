import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { redirect, RedirectType } from "next/navigation";

export default async function Home() {
  const workspaces = await fetchQuery(
    api.workspaces.getUserWorkspaces,
    {},
    {
      token: convexAuthNextjsToken(),
    }
  );

  console.log("server-workspaces", workspaces);

  if (!workspaces || workspaces.length === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces[0]?._id}`);
  }
}
