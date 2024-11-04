import { SettingsIcon, UsersIcon } from "lucide-react";

import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

export const Routes = [
  {
    label: "Home" as const,
    href: "",
    filledIcon: GoHomeFill,
    Icon: GoHome,
  },
  {
    label: "My Tasks" as const,
    href: "/tasks",
    Icon: GoCheckCircle,
    filledIcon: GoCheckCircleFill,
  },
  {
    label: "Settings" as const,
    href: "/settings",
    filledIcon: SettingsIcon,
    Icon: SettingsIcon,
  },
  {
    label: "Users" as const,
    href: "/users",
    filledIcon: UsersIcon,
    Icon: UsersIcon,
  },
];
