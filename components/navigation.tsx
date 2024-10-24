import { Routes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

function Navigation() {
  return (
    <ul className="flex flex-col ">
      {Routes.map((route) => {
        const isActive = false;
        const Icon = isActive ? route.filledIcon : route.Icon;
        return (
          <Link key={route.href} href={route.href}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 font-medium transition rounded-md hover:text-primary text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {route.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
}

export default Navigation;
