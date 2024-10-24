"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { DottedSeparator } from "@/components/doted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAuthActions } from "@convex-dev/auth/react";

import { signupSchema } from "../schemas";
import { useState } from "react";
import { toast } from "sonner";

export function SignUpCard() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const { signIn } = useAuthActions();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({
    email,
    name,
    password,
  }: z.infer<typeof signupSchema>) => {
    setIsRegistering(true);
    try {
      await signIn("password", { email, password, name, flow: "signUp" });
      toast.success("Registered Successfully");
      router.replace("/");
    } catch (error) {
      toast.error("Failed to Register");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Card className="w-full h-full md:w-[486px] border-none shadow-none ">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription className="text-2xl">
          By signing up you agree to our {""}
          <Link href="">
            <span className="text-blue-700">Privacy policy</span>
          </Link>
          and {""}
          <Link href="">
            <span className="text-blue-700">Terms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7 ">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter Email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isRegistering} size="lg" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="flex flex-col p-7 gap-y-4">
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={false}
        >
          <FcGoogle className="mr-2 size-5" />
          Log In with Google
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={false}
        >
          <FaGithub className="mr-2 size-5" />
          Log In with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p className="">
          Already have an account?
          <Link href="/sign-in">
            <span className="text-blue-700"> Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
