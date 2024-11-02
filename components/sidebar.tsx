import Image from "next/image";
import Link from "next/link";
import { DottedSeparator } from "./doted-separator";
import Navigation from "./navigation";
import WorkspaceSwitcher from "./workspace-switcher";

function Sidebar() {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full ">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <Image src="/logo.svg" alt="logo" width={50} height={50} />
          <p>FUTO-TEAM</p>
        </div>
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
    </aside>
  );
}

export default Sidebar;
