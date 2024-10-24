"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { DottedSeparator } from "@/components/doted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
  FormMessage,
} from "@/components/ui/form";

import { createWorkspaceSchema } from "../schema";
import { useCreateWorkspace } from "../api/use-create-workspace";

interface createWorkspaceFormProps {
  onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: createWorkspaceFormProps) => {
  const { mutate: createWorkspace, isPending: isCreatingWorkspace } =
    useCreateWorkspace();
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(createWorkspaceSchema),
  });

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    createWorkspace(
      {
        workspaceName: values.name,
      },
      {
        onSuccess() {
          form.reset();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-lg fontbold">
          Create a new Workspace
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Workspace Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={false}
              >
                Cancel
              </Button>
              <Button disabled={isCreatingWorkspace} type="submit" size="lg">
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
