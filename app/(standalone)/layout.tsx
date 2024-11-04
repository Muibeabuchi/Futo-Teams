import { UserButton } from "@/features/auth/components/user-button";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface StandaloneLayoutProps {
  children: ReactNode;
}

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <main className="bg-neutral-100 min-h-screen ">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between h-[73px]">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={50} height={50} />
          </Link>
          <UserButton />
        </nav>
        <div className="flex py-4 flex-col justify-center items-center">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
