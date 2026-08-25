"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "@/lib/validation/auth";
import { useRegister, useLogin } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/shared/PasswordInput";

export default function RegisterPage() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", username: "", email: "", password: "" },
    mode: "all",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarError, setAvatarError] = useState("");

  const { mutate: registerUser, isPending: isRegistering } = useRegister();
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const isPending = isRegistering || isLoggingIn;

  const onSubmit = (values) => {
    if (!avatar) {
      setAvatarError("Avatar image is required");
      return;
    }
    setAvatarError("");

    const fd = new FormData();
    fd.append("fullName", values.fullName);
    fd.append("username", values.username);
    fd.append("email", values.email);
    fd.append("password", values.password);
    fd.append("avatar", avatar);
    if (coverImage) fd.append("coverImage", coverImage);

    // Register success ke baad seedha auto-login → dashboard.
    registerUser(fd, {
      onSuccess: () =>
        login({ username: values.username, password: values.password }),
    });
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Join MyTube and start sharing videos</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            control={control}
            name="fullName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                <Input id="fullName" placeholder="John Doe" {...field} />
                <FieldError errors={fieldState.error ? [fieldState.error] : []} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" placeholder="johndoe" {...field} />
                <FieldError errors={fieldState.error ? [fieldState.error] : []} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="you@example.com" {...field} />
                <FieldError errors={fieldState.error ? [fieldState.error] : []} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput field={field} />
                <FieldError errors={fieldState.error ? [fieldState.error] : []} />
              </Field>
            )}
          />

          {/* Avatar – required */}
          <Field data-invalid={!!avatarError}>
            <FieldLabel htmlFor="avatar">
              Avatar <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setAvatar(e.target.files?.[0] || null);
                setAvatarError("");
              }}
            />
            {avatarError && <p className="text-sm text-destructive">{avatarError}</p>}
          </Field>

          {/* Cover image – optional */}
          <Field>
            <FieldLabel htmlFor="coverImage">
              Cover image{" "}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />
          </Field>

          <Button type="submit" className="mt-2 w-full" disabled={isPending}>
            {isPending ? "Creating account..." : "Sign up"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline underline-offset-4">
              Log in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
