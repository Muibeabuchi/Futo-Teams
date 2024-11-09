import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const ProjectAvatar = ({
  name,
  className,
  image,
  fallbackClassName,
}: ProjectAvatarProps) => {
  const avatarFallback = name.charAt(0).toUpperCase();

  if (image) {
    return (
      <div
        className={cn("size-5 rounded-md relative overflow-hidden", className)}
      >
        <Image src={image} fill alt={name} className="object-cover" />
      </div>
    );
  }
  return (
    <Avatar className={cn("size-5 rounded-md", className)}>
      {/* not using the avatar image component due to noticeable flickering effect */}
      <AvatarFallback
        className={cn(
          "text-white rounded-md  bg-blue-600 font-semibold text-sm uppercase",
          fallbackClassName
        )}
      >
        {avatarFallback}
      </AvatarFallback>
    </Avatar>
  );
};
