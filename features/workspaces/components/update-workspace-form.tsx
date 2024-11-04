"use client";

import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Doc } from "@/convex/_generated/dataModel";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { updateWorkspaceSchema } from "../schema";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useGenerateUploadUrl } from "../api/use-generate-workspace-image-upload-url";
import { useWorkspaceId } from "../hooks/use-workspace-id";

interface updateWorkspaceFormProps {
  onCancel?: () => void;
  //   TODO: Omit some fields from this value
  initialValues: Omit<Doc<"workspaces">, "workspaceAvatar"> & {
    workspaceImage: string;
  };
}

export const UpdateWorkspaceForm = ({
  onCancel,
  initialValues,
}: updateWorkspaceFormProps) => {
  const router = useRouter();
  const workspaceImageRef = useRef<HTMLImageElement>(null);
  const workspaceId = useWorkspaceId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { handleSendImage } = useGenerateUploadUrl();
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    defaultValues: {
      ...initialValues,
      name: initialValues.workspaceName,
      image: initialValues.workspaceImage ?? "",
    },
    resolver: zodResolver(updateWorkspaceSchema),
  });

  //   form.getValues("")

  const onSubmit = async (values: z.infer<typeof updateWorkspaceSchema>) => {
    try {
      const storageId = await handleSendImage(
        typeof values.image !== "string" ? values.image : undefined
      );
      if (workspaceImageRef.current)
        URL.revokeObjectURL(workspaceImageRef.current.src);
      updateWorkspace(
        {
          workspaceName: values.name,
          workspaceImageId: storageId,
          workspaceId,
        },
        {
          onSuccess() {
            // form.reset();
            router.push(`/workspaces/${initialValues._id}`);
          },
          onSettled() {
            router.refresh();
          },
        }
      );
    } catch (error) {
      toast.error(`There was an error while uploading the image  ${error}`);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) form.setValue("image", file);
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4 space-y-0 p-7">
        <Button
          onClick={
            onCancel
              ? onCancel
              : () => router.push(`/workspaces/${initialValues._id}`)
          }
          variant="secondary"
          size="sm"
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Back
        </Button>
        <CardTitle className="text-lg fontbold">
          {initialValues.workspaceName}
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

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => {
                  return (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] overflow-hidden rounded-md relative">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="logo"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px]" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="test-sm">Workspace Icon</p>
                          <p className="test-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG, max1 mb
                          </p>
                          <input
                            className="hidden"
                            type="file"
                            accept=".jpg, .png, .jpeg, .svg"
                            ref={inputRef}
                            // disabled={isCreatingWorkspace}
                            onChange={handleImageChange}
                            // {...field}
                          />
                          {field?.value ? (
                            <Button
                              type="button"
                              disabled={form.formState.isSubmitting}
                              variant="destructive"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                                if (workspaceImageRef.current) {
                                  URL.revokeObjectURL(
                                    workspaceImageRef.current.src
                                  );
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={form.formState.isSubmitting}
                              variant="territory"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click?.()}
                            >
                              Upload Image
                            </Button>
                          )}{" "}
                        </div>
                      </div>
                    </div>
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
                disabled={form.formState.isSubmitting}
                className={cn(!!onCancel ? "visible" : "invisible")}
              >
                Cancel
              </Button>
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                size="lg"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
