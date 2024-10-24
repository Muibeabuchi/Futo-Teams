import { SettingsIcon, UsersIcon } from "lucide-react";

import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

export const Routes = [
  {
    label: "Home",
    href: "",
    filledIcon: GoHomeFill,
    Icon: GoHome,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    Icon: GoCheckCircle,
    filledIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    filledIcon: SettingsIcon,
    Icon: SettingsIcon,
  },
  {
    label: "Users",
    href: "/users",
    filledIcon: UsersIcon,
    Icon: UsersIcon,
  },
];
