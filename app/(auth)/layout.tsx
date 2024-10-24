"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function Authlayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  return (
    <main className="bg-neutral-100 min-h-screen w-full">
      <div className="mx-auto max-w-screen-2xl p-4 h-full">
        <nav className="flex justify-between items-center ">
          <Image src="/logo.svg" alt="logo" width={50} height={50} />
          <Button asChild variant="secondary">
            <Link href={isSignIn ? "/sign-up" : "sign-in"}>
              {isSignIn ? "Sign Up" : "Sign In"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}
